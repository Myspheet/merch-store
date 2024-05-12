import { ConflictException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Category } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class VariationRepository {
    constructor(private readonly prismaService: PrismaService) { }

    async findAll(productId) {
        try {
            const variations = await this.prismaService.variation.findMany({
                where: { productId },
                include: {
                    attribute: true,
                    attributeValue: true
                }
            });
            return variations;
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

    async create(createVariationDto, productId) {
        try {
            const variation = await this.prismaService.variation.create({
                data: { ...createVariationDto }
            });

            return variation;
        } catch (error) {
            console.log(error);
            if (error.code == 'P2002') {
                throw new ConflictException("The category already exists");
            }

            throw new HttpException("There was an error, please try again", HttpStatus.BAD_REQUEST);
        }
    }

    async update(id: number, updateProductDto) {
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
