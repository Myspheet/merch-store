import { registerAs } from "@nestjs/config";

export default registerAs('jwt', () => {
    return {
        secret: process.env.JWT_SECRET,
        accessTokenTtl: parseInt(process.env.JWT_TOKEN_TTL),
        refreshSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
        refreshTokenTtl: parseInt(process.env.JWT_REFRESH_TOKEN_TTL)
    }
});