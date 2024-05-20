import { ConflictException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Category } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateAttributeDto } from '../dto/update-attribute.dto';
import { CreateAttributeDto } from '../dto/create-attribute.dto';
import { CreateAttributeValueDto } from '../dto/create-attribute-value.dto';


@Injectable()
export class AttributeRepository {
    constructor(private readonly prismaService: PrismaService) { }

    async findAll() {
        try {
            const attributes = await this.getModel().findMany({
                include: {
                    attributeValues: true
                }
            });

            return { message: "Successful", attributes };
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
            const attribute = await this.getModel().findUnique({
                where: { id },
                include: {
                    attributeValues: true
                }
            });

            return { message: "Successful", attribute };
        } catch (error) {
            throw new HttpException("There was an error, please try again", HttpStatus.BAD_REQUEST);
        }
    }

    async create(createAttributeDto: CreateAttributeDto) {
        try {
            const attribute = await this.getModel().create({
                data: { ...createAttributeDto }
            });

            return { message: "Successful Created Attribute", attribute };
        } catch (error) {
            console.log(error);
            if (error.code == 'P2002') {
                throw new ConflictException("The attribute already exists");
            }

            throw new HttpException("There was an error, please try again", HttpStatus.BAD_REQUEST);
        }
    }

    async addAttributeValue(attributeId: number, createAttributeValueDto: CreateAttributeValueDto) {
        try {
            const { attributeValues } = createAttributeValueDto;
            const attribute = await this.getModel().update({
                where: { id: attributeId },
                data: {
                    attributeValues: {
                        create: attributeValues
                    }
                }
            });

            return { message: "Successful", attribute };
        } catch (error) {
            console.log(error);
            if (error.code == 'P2002') {
                throw new ConflictException("The attribute already exists");
            }

            throw new HttpException("There was an error, please try again", HttpStatus.BAD_REQUEST);
        }
    }

    async update(id: number, updateAttributeDto: UpdateAttributeDto) {
        try {
            const attribute = await this.getModel().update({
                data: { ...updateAttributeDto },
                where: { id }
            });

            return { message: "Successfully Updated Attribute", attribute };
        } catch (error) {
            console.log(error);
            if (error.code == 'P2002') {
                throw new ConflictException("The Attribute already exists");
            }

            throw new HttpException("There was an error, please try again", HttpStatus.BAD_REQUEST);
        }
    }

    async delete(id: number) {
        try {
            const attribute = await this.getModel().delete({
                where: { id }
            });

            return { message: "Successful Deleted Attribute" };

        } catch (error) {
            throw new HttpException("There was an error, please try again", HttpStatus.BAD_REQUEST);
        }
    }

    private getModel() {
        return this.prismaService.attribute;
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
