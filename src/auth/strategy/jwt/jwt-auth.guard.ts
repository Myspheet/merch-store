import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { TokenExpiredError } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    handleRequest(err, user, info) {
        // You can throw an exception based on either "info" or "err" arguments
        if (err || !user) {
            if (info.name == 'TokenExpiredError') {
                throw new UnauthorizedException("Token Expired");
            }
            throw err || new UnauthorizedException();
        }
        return user;
    }
}
