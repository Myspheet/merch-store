import { Prisma } from "@prisma/client";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";


export class DeliveryInformation {
    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string;

    @ApiProperty()
    address: string;

    @ApiProperty()
    city: string;

    @ApiPropertyOptional()
    zipCode?: string;

    @ApiProperty()
    mobileNumber: string;

    @ApiProperty()
    email: string;
}

export class OrderItem {
    @ApiProperty()
    productId: number;

    @ApiProperty()
    productName: string;

    @ApiProperty()
    price: Prisma.Decimal;

    @ApiProperty()
    quantity: number;

    @ApiProperty()
    attributes: Prisma.JsonArray;

    @ApiProperty()
    prouctImage: string;
}



export class CreateOrderDto {
    @ApiProperty()
    deliveryInformation: DeliveryInformation;

    @ApiProperty()
    orderItems: OrderItem[]
}
