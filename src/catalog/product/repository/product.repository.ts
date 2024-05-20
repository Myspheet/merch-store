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
            const products = await this.getModel().findMany({
                include: {
                    variations: {
                        include: {
                            attributeValue: true
                        }
                    },
                    gallery: true
                }
            });

            return { message: "Successful", products };
        } catch (error) {
            throw new HttpException("There was an error, please try again", HttpStatus.BAD_REQUEST);
        }
    }

    // Use only for auth modules as it returns the password as well
    // async findBySlug(slug: string) {
    //     const category = await this.getModel().findUnique({
    //         where: { slug }
    //     })
    //     return category;
    // }

    async findById(id: number) {
        try {
            const product = await this.getModel().findUnique({
                where: { id },
                include: {
                    variations: {
                        include: {
                            attributeValue: true
                        }
                    },
                    gallery: true
                }
            });

            return { message: "Successful ", product };
        } catch (error) {
            throw new HttpException("There was an error, please try again", HttpStatus.BAD_REQUEST);
        }
    }

    async create(createProductDto, gallery = []) {
        try {
            const product = await this.getModel().create({
                data: {
                    ...createProductDto,
                    gallery: {
                        create: gallery
                    }
                }
            });

            return { message: "Product Created Successfully", product };
        } catch (error) {
            console.log(error);
            if (error.code == 'P2002') {
                throw new ConflictException("The category already exists");
            }

            throw new HttpException("There was an error, please try again", HttpStatus.BAD_REQUEST);
        }
    }

    async createProductWithVariation(createProduct, variation, gallery = []) {
        try {
            const product = await this.getModel().create({
                data: {
                    ...createProduct,
                    variations: {
                        create: variation
                    },
                    gallery: {
                        create: gallery
                    }
                }
            });

            return { message: "Product Created Successfully", product };
        } catch (error) {
            console.log('error', error)
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    async update(id: number, updateProductDto: UpdateProductDto) {
        try {
            const product = await this.getModel().update({
                data: { ...updateProductDto },
                where: { id }
            });

            return { message: "Product Updated Successfully", product };
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
            const product = await this.getModel().delete({
                where: { id }
            });

            return { message: "Product deleted successfully", data: [] };
        } catch (error) {
            throw new HttpException("There was an error, please try again", HttpStatus.BAD_REQUEST);
        }
    }

    private getModel() {
        return this.prismaService.product;
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
