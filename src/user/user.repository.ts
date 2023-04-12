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

    async findAll() {
        try {
            const users = await this.getModel().findMany({
                where: { role: 15 }
            });

            return users;
        } catch (error) {
            throw new HttpException('There was an error', HttpStatus.BAD_REQUEST);
        }
    }

    async create(createTenantDto: UserEntity) {
        try {
            const user = await this.getModel().create({
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

    async updateRefreshToken(userId: number, refreshToken: string) {
        const user = await this.getModel().update({
            where: { id: userId },
            data: { refreshToken }
        });

        return this.exclude(user, ['password']);
    }

    private getModel() {
        return this.prismaService.user;
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
