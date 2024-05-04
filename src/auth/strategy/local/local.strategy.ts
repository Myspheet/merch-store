import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(email: string, password: string): Promise<any> {
    const tenant = await this.authService.validateUser(email, password);
    if (!tenant) {
      console.log('hello');
      throw new UnauthorizedException("Invalid Email or Password");
    }
    console.log('hello from wakanda');
    return tenant;
  }
}