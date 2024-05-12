import { ConflictException, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AdminRepository {
    constructor(private readonly prismaService: PrismaService) { }

    // Use only for auth modules as it returns the password as well
    async findByEmail(email: string) {
        const user = await this.getModel().findUnique({
            where: { email }
        })
        return user;
    }

    async findByEmailAndId(email: string, id: number) {
        try {
            const user = await this.getModel().findUnique({
                where: { id, email }
            });

            if (!user) {
                throw new UnauthorizedException();
            }

            return this.exclude(user, ['password']);

        } catch (error) {

        }
    }

    async findById(id: number) {
        const user = await this.getModel().findUnique({
            where: { id }
        });

        return this.exclude(user, ['password']);
    }

    async findAll() {
        try {
            const users = await this.getModel().findMany({
                where: { role: 10 }
            });

            return users;
        } catch (error) {
            throw new HttpException('There was an error', HttpStatus.BAD_REQUEST);
        }
    }

    async create(createTenantDto) {
        try {
            const user = await this.getModel().create({
                data: { ...createTenantDto }
            });

            return this.exclude(user, ['password']);
        } catch (error) {
            if (error.code == 'P2002') {
                throw new ConflictException("A user with this email already exists");
            }

            throw new HttpException("There was an error creating user, please try again", HttpStatus.BAD_REQUEST);
        }
    }

    async update(userId: number, updateUserDto) {
        try {
            const user = await this.getModel().update({
                where: { id: userId },
                data: { ...updateUserDto }
            });

            return user;
        } catch (error) {
            throw new HttpException("There was an error creating user, please try again", HttpStatus.BAD_REQUEST);
        }
    }

    async delete(userId) {
        try {
            const user = this.getModel().delete({
                where: { id: userId }
            });

            return { message: "User deleted Successfully" };
        } catch (error) {
            throw new HttpException("There was an error creating user, please try again", HttpStatus.BAD_REQUEST);
        }
    }

    // async updateRefreshToken(userId: number, refreshToken: string) {
    //     const user = await this.getModel().update({
    //         where: { id: userId },
    //         data: { refresh_token: refreshToken }
    //     });

    //     return this.exclude(user, ['password']);
    // }

    private getModel() {
        return this.prismaService.admin;
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
