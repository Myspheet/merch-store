import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService, ConfigType } from '@nestjs/config';
import { UserRepository } from 'src/user/user.repository';
import { JwtPayload } from './jwt-payload.interface';
import jwtConfig from 'src/auth/config/jwt.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userRepository: UserRepository,
    @Inject(jwtConfig.KEY)
    private jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {
    super({
      secretOrKey: jwtConfiguration.secret,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayload) {
    const { sub } = payload;

    const user = await this.userRepository.findById(sub);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
