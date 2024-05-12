import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService, ConfigType } from '@nestjs/config';
import { UserRepository } from 'src/user/user.repository';
import { JwtPayload } from './jwt-payload.interface';
import jwtConfig from 'src/auth/config/jwt.config';
import { AdminRepository } from 'src/auth/repository/admin.repository';

@Injectable()
export class AdminJwtStrategy extends PassportStrategy(Strategy, 'admin-jwt') {
    constructor(
        private adminRepository: AdminRepository,
        @Inject(jwtConfig.KEY)
        private jwtConfiguration: ConfigType<typeof jwtConfig>,
    ) {
        super({
            secretOrKey: jwtConfiguration.secret,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        });
    }

    async validate(jwtPayload) {
        const { sub, payload } = jwtPayload;

        const user = await this.adminRepository.findByEmailAndId(payload.email, sub);

        if (!user || user.role !== payload.role) {
            throw new UnauthorizedException();
        }

        return user;
    }
}
