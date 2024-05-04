import { ConflictException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserEntity } from './entity/user.entity';

@Injectable()
export class UserRepository {
    constructor(private readonly prismaService: PrismaService) { }

    // Use only for auth modules as it returns the password as well
    async findByEmail(email: string) {
        const user = await this.prismaService.user.findUnique({
            where: { email }
        })
        return user;
    }

    async findById(id: number) {
        const user = await this.prismaService.user.findUnique({
            where: { id }
        });

        return this.exclude(user, ['password']);
    }

    async create(createTenantDto: UserEntity) {
        try {
            const user = await this.prismaService.user.create({
                data: { ...createTenantDto }
            });

            return this.exclude(user, ['password']);
        } catch (error) {
            console.log(error);
            if (error.code == 'P2002') {
                throw new ConflictException("A user with this email already exists");
            }

            throw new HttpException("There was an error creating user, please try again", HttpStatus.BAD_REQUEST);
        }
    }

    async updateRefreshToken(userId: number, refreshToken: string) {
        const user = await this.prismaService.user.update({
            where: { id: userId },
            data: { refresh_token: refreshToken }
        });

        return this.exclude(user, ['password']);
    }

    private exclude<User, Key extends keyof User>(
        user: User,
        keys: Key[]
    ) {
        return Object.fromEntries(
            Object.entries(user).filter(([key]) => !keys.includes(key as Key))
        );
    }
}
