import { ConflictException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Category } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { Category as CategoryEntity } from '../entities/category.entity';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';

@Injectable()
export class CategoryRepository {
    constructor(private readonly prismaService: PrismaService) { }

    async findAll() {
        try {
            const categories = await this.prismaService.category.findMany();

            return { message: "Successful", categories };
        } catch (error) {
            throw new HttpException("There was an error, please try again", HttpStatus.BAD_REQUEST);
        }
    }

    // Use only for auth modules as it returns the password as well
    async findBySlug(slug: string) {
        const category = await this.prismaService.category.findUnique({
            where: { slug },
            include: {
                products: true
            }
        })
        return { message: "Successful", category };
    }

    async findById(id: number) {
        const category = await this.prismaService.category.findUnique({
            where: { id }
        });

        return { message: "Successful", category };
    }

    async findCategoryProducts(id: number) {
        const category = await this.prismaService.category.findUnique({
            where: { id },
            include: {
                products: {
                    include: {
                        variations: true,
                        gallery: true
                    },
                }
            }
        });

        return { message: "Successful", category };
    }

    async create(createCategoryDto: CreateCategoryDto) {
        try {
            const category = await this.prismaService.category.create({
                data: { ...createCategoryDto }
            });

            return { message: "Successfully Created Category", category };
        } catch (error) {
            console.log(error);
            if (error.code == 'P2002') {
                throw new ConflictException("The category already exists");
            }

            throw new HttpException("There was an error, please try again", HttpStatus.BAD_REQUEST);
        }
    }

    async update(id: number, updateCategoryDto: UpdateCategoryDto) {
        try {
            const category = await this.prismaService.category.update({
                data: { ...updateCategoryDto },
                where: { id }
            });

            return { message: "Successfully Updated Category", category };
        } catch (error) {
            console.log(error);
            if (error.code == 'P2002') {
                throw new ConflictException("The category already exists");
            }

            throw new HttpException("There was an error, please try again", HttpStatus.BAD_REQUEST);
        }
    }

    async delete(id: number) {
        try {
            const category = await this.prismaService.category.delete({
                where: { id }
            });

            return { message: "Successfully Deleted Category" };
        } catch (error) {
            throw new HttpException("There was an error, please try again", HttpStatus.BAD_REQUEST);
        }
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
