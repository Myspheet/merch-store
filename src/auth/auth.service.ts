import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { HashingService } from './hashing/hashing.service';
import { UserRepository } from 'src/user/user.repository';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/singup.dto';
import { SignInDto } from './dto/signin.dto';
import { ConfigType } from '@nestjs/config';
import { JwtPayload } from './strategy/jwt/jwt-payload.interface';
import jwtConfig from './config/jwt.config';
import { GoogleSigninDto } from './dto/google-signin.dto';
import { UserEntity } from 'src/user/entity/user.entity';
import { RefreshTokenRepository } from './repository/refreshToken.repository';

@Injectable()
export class AuthService {
    constructor(
        private userRepository: UserRepository,
        private hashingService: HashingService,
        @Inject(jwtConfig.KEY)
        private jwtConfiguration: ConfigType<typeof jwtConfig>,
        private jwtService: JwtService,
        private refreshTokenRepository: RefreshTokenRepository
    ) { }

    async validateUser(email: string, pass?: string): Promise<any> {
        const user = await this.userRepository.findByEmail(email);
        if (user && user.password === pass) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async validateGoogleUser(profileDetails: GoogleSigninDto) {
        const user = await this.userRepository.findByEmail(profileDetails.email);
        if (!user) {
            const newUser = this.userRepository.create(profileDetails as UserEntity);
            return newUser;
        }
        return user;
    }

    async signUp(signUpDto: SignUpDto) {
        const { password } = signUpDto;
        const hashedPassword = await this.hashingService.hash(password);

        return this.userRepository.create({ ...signUpDto, password: hashedPassword });
    }

    async signIn(signInDto: SignInDto) {
        const { email, password } = signInDto;
        const user = await this.userRepository.findByEmail(email);

        if (user && this.hashingService.compare(password, user.password)) {
            const { id: sub } = user;
            const payload: JwtPayload = { email, sub };

            return this.generateTokens({ sub, email });
        } else {
            throw new UnauthorizedException("Invalid Email or Password");
        }
    }

    async handleGoogleRedirect(user: UserEntity) {
        return this.generateTokens({ sub: user.id, email: user.email });
    }

    async logout(token: string) {
        //delete the refreshtoken from the refrestToken table
        await this.refreshTokenRepository.delete({ access_token: token });
        return { message: 'Logout Successfully' }
    }

    async refreshToken(refreshToken: string, user) {
        try {
            const { sub } = await this.jwtService.verifyAsync(refreshToken, {
                secret: this.jwtConfiguration.refreshSecret
            })

            const token = await this.refreshTokenRepository.findByRefreshToken(refreshToken);

            if (token.refresh_token != refreshToken && token.access_token !== user.accessToken) throw new UnauthorizedException("Invalid Tokens");

            return this.generateTokens({ sub: token.user.id, email: token.user.email }, refreshToken);
        } catch (error) {
            throw new UnauthorizedException('Invalid tokens');
        }
    }

    async verifyToken(user: UserEntity, token: string) {
        const validToken = await this.refreshTokenRepository.findByAccessToken(token) ?? false;

        if (!validToken || user.id !== validToken.user.id) {
            throw new UnauthorizedException('Invalid Tokens');
        }

        return { user };
    }

    private async generateTokens(user: JwtPayload, oldRefreshToken?: string) {
        const { sub, email } = user;
        const [accessToken, refreshToken] = await Promise.all([
            this.signToken(sub, this.jwtConfiguration.accessTokenTtl, this.jwtConfiguration.secret, { email }),
            this.signToken(sub, this.jwtConfiguration.refreshTokenTtl, this.jwtConfiguration.refreshSecret)
        ]);

        if (oldRefreshToken) {
            await this.refreshTokenRepository.update({ accessToken, refreshToken }, oldRefreshToken);
        } else {
            await this.refreshTokenRepository.create({ accessToken, refreshToken, userId: sub });
        }

        return { accessToken, refreshToken };
    }

    // Sign the jwt
    private async signToken<T>(userId: number, expiresIn: number, jwtSecret: string, payload?: T) {
        return await this.jwtService.signAsync(
            {
                sub: userId,
                ...payload,
            },
            {
                secret: jwtSecret,
                expiresIn,
            });
    }
}
