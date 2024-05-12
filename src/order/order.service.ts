import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderRepository } from './repository/order.repository';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository
  ) { }
  create(createOrderDto: CreateOrderDto, userId) {
    return this.orderRepository.create(createOrderDto, userId);
  }

  findAll(userId = null) {
    return this.findAll(userId);
  }

  findOne(id: number) {
    return this.orderRepository.findById(id);
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  updateOrderStatus(orderId: number, orderStatus: string) {
    return this.orderRepository.updateOrderStatus(orderId, orderStatus);
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
