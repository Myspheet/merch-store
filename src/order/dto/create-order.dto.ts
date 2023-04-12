import { Prisma } from "@prisma/client";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsDecimal, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";


export class DeliveryInformation {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    lastName: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    address: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    city: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    zipCode?: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    mobileNumber: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;
}


export class OrderItem {
    @ApiProperty()
    @IsNumber()
    productId: number;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    productName: string;

    @ApiProperty()
    @IsDecimal()
    price: Prisma.Decimal;

    @ApiProperty()
    @IsNumber()
    quantity: number;

    @ApiProperty()
    attributes: Prisma.JsonArray;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    prouctImage: string;
}


export class CreateOrderDto {
    @ApiProperty()
    deliveryInformation: DeliveryInformation;

    @ApiProperty()
    orderItems: OrderItem[]

    @ApiProperty()
    @IsNumber()
    paymentMethodId

    @ApiProperty()
    @IsOptional()
    @IsString()
    transactionCode?: string;

    @ApiProperty()
    subtotal: Prisma.Decimal

    @ApiProperty()
    total: Prisma.Decimal
}
