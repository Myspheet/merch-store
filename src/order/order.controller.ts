import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto, UpdateOrderStatusDto } from './dto/update-order.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/strategy/jwt/jwt-auth.guard';
import { AdminJwtAuthGuard } from 'src/auth/strategy/jwt/admin-auth.guard';
import { GetUser } from 'src/auth/get-user.decorator';

@ApiTags('Orders')
// @UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrderController {
  userId = 1;

  constructor(private readonly orderService: OrderService) { }

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto, this.userId);
  }

  @Get()
  findAll(@GetUser() user) {
    console.log('user', user);
    const isAdmin = 107;
    // if (user.role == isAdmin) {
      return this.orderService.findAll();
    // }
    // return this.orderService.findAll(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(+id, updateOrderDto);
  }

  @Patch(':id/status')
  @UseGuards(AdminJwtAuthGuard)
  updateOrderStatus(@Param('id') id: string, @Body() orderStatusDto: UpdateOrderStatusDto) {
    return this.orderService.updateOrderStatus(+id, orderStatusDto.orderStatus);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(+id);
  }
}
