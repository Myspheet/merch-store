import { ConflictException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Category, OrderItem } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { Order as OrderEntity } from '../entities/order.entity';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';

@Injectable()
export class OrderRepository {
    constructor(private readonly prismaService: PrismaService) { }

    async findAll(userId = null) {
        try {
            let orders;
            if (userId) {
                orders = await this.getModel().findMany({
                    where: { userId },
                    include: {
                        orderItems: true,
                        deliveryInformation: true
                    }
                });
            } else {
                orders = await this.getModel().findMany({
                    include: {
                        orderItems: true,
                        deliveryInformation: true
                    }
                });
            }

            return { message: "Successful", orders };

        } catch (error) {
            throw new HttpException("There was an error, please try again", HttpStatus.BAD_REQUEST);
        }
    }

    // Use only for auth modules as it returns the password as well
    // async findBySlug(slug: string) {
    //     const category = await this.prismaService.order.findUnique({
    //         where: { slug }
    //     })
    //     return category;
    // }

    async findById(id: number) {
        try {
            const order = await this.getModel().findUnique({
                where: { id },
                include: {
                    orderItems: true,
                    deliveryInformation: true,
                    user: {
                        select: {
                            email: true,
                            phone_number: true
                        }
                    }
                }
            });

            return { message: "Successfull", order };

        } catch (error) {
            console.log(error);
            throw new HttpException("There was an error, please try again", HttpStatus.BAD_REQUEST);
        }
    }

    async create(createOrderDto: CreateOrderDto, userId: number) {
        try {
            const { deliveryInformation, orderItems } = createOrderDto
            const order = await this.getModel().create({
                data: {
                    userId,
                    deliveryInformation: {
                        create: { ...deliveryInformation }
                    },
                    orderItems: {
                        create: orderItems
                    }
                }
            });

            return { message: "Order placed successfully", order };
        } catch (error) {
            throw new HttpException("There was an error, please try again", HttpStatus.BAD_REQUEST);
        }
    }

    async createOrderWithVariation(createOrder, variation) {
        try {
            const order = await this.getModel().create({
                data: {
                    ...createOrder,
                    variations: {
                        create: variation
                    }
                }
            });

            return { mesage: "Order Created Successfully", order };
        } catch (error) {

        }
    }

    async update(id: number, updateOrderDto) {
        try {
            const order = await this.getModel().update({
                data: { ...updateOrderDto },
                where: { id }
            });

            return { message: "Order Updated Successfully", order };
        } catch (error) {
            console.log(error);
            if (error.code == 'P2002') {
                throw new ConflictException("The category already exists");
            }

            throw new HttpException("There was an error, please try again", HttpStatus.BAD_REQUEST);
        }
    }

    async updateOrderStatus(orderId, orderStatus) {
        try {
            const order = await this.getModel().update({
                data: { status: orderStatus },
                where: { id: orderId }
            });

            return { message: "Order Status has been updated", order };
        } catch (error) {
            console.log(error);
            throw new HttpException("There was an error, please try again", HttpStatus.BAD_REQUEST);
        }
    }

    async delete(id: number) {
        try {
            const order = await this.getModel().delete({
                where: { id }
            });

            return { message: "Order has been deleted successfully" };
        } catch (error) {
            console.log(error);
            throw new HttpException("There was an error, please try again", HttpStatus.BAD_REQUEST);
        }
    }

    private getModel() {
        return this.prismaService.order;
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
