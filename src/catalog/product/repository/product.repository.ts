import { ConflictException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Category } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { Product as ProductEntity } from '../entities/product.entity';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';

@Injectable()
export class ProductRepository {
    constructor(private readonly prismaService: PrismaService) { }

    async findAll() {
        try {
            const products = await this.prismaService.product.findMany();
            return products;
        } catch (error) {

        }
    }

    // Use only for auth modules as it returns the password as well
    // async findBySlug(slug: string) {
    //     const category = await this.prismaService.product.findUnique({
    //         where: { slug }
    //     })
    //     return category;
    // }

    async findById(id: number) {
        const category = await this.prismaService.product.findUnique({
            where: { id }
        });

        return category;
    }

    async create(createProductDto: CreateProductDto) {
        try {
            const user = await this.prismaService.product.create({
                data: { ...createProductDto }
            });

            return user;
        } catch (error) {
            console.log(error);
            if (error.code == 'P2002') {
                throw new ConflictException("The category already exists");
            }

            throw new HttpException("There was an error, please try again", HttpStatus.BAD_REQUEST);
        }
    }

    async update(id: number, updateProductDto: UpdateProductDto) {
        try {
            const category = await this.prismaService.product.update({
                data: { ...updateProductDto },
                where: { id }
            });

            return category;
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
            const category = await this.prismaService.product.delete({
                where: { id }
            });

            return true;
        } catch (error) {

        }

        return false;
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
