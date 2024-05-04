import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class RefreshTokenGuard extends AuthGuard('jwt') {
    handleRequest(err, user, info, context: ExecutionContext) {
        const token = context.switchToHttp().getRequest().headers['authorization'].split(" ")[1];
        // You can throw an exception based on either "info" or "err" arguments
        if ((err || !user) && info.name != 'TokenExpiredError') {
            throw err || new UnauthorizedException();
        }

        // Creates the user object so the flow can continue
        if (!user) {
            user = {};
            user.isTokenExpired = true;
            user.accessToken = token ?? '';
        }

        return user;
    }
}
