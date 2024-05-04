import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RefreshTokenRepository {
    constructor(private readonly prismaService: PrismaService) { }

    async findByRefreshToken(refreshToken: string) {
        const token = await this.prismaService.refreshToken.findUnique({
            where: { refresh_token: refreshToken },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                    },
                },
            },
        });

        return token;
    }

    async findByAccessToken(accessToken: string) {
        const token = await this.prismaService.refreshToken.findUnique({
            where: { access_token: accessToken },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                    },
                },
            },
        });

        return token;
    }

    async create(createRefreshToken) {
        try {
            const { refreshToken, accessToken, userId } = createRefreshToken;
            const newRefreshToken = await this.prismaService.refreshToken.create({
                data: { refresh_token: refreshToken, access_token: accessToken, userId },
            });

            return newRefreshToken;
        } catch (error) {
            throw new HttpException("There was an error creating refreshToken, please try again", HttpStatus.BAD_REQUEST);
        }
    }

    async update(updateRefreshTokenDto, oldRefreshToken?: string) {
        const { refreshToken, accessToken } = updateRefreshTokenDto;
        const newRefreshToken = await this.prismaService.refreshToken.update({
            where: { refresh_token: oldRefreshToken },
            data: { refresh_token: refreshToken, access_token: accessToken },
        });

        return newRefreshToken
    }

    async delete(token) {
        const deletedToken = await this.prismaService.refreshToken.delete({
            where: token
        });

        return deletedToken;
    }
}
