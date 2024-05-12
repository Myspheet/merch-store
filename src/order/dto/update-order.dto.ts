import { PartialType } from '@nestjs/swagger';
import { CreateOrderDto } from './create-order.dto';

export class UpdateOrderDto extends PartialType(CreateOrderDto) { }

export class UpdateOrderStatusDto {
    orderStatus: string;
}
