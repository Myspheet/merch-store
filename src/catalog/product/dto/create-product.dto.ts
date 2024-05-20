import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateProductDto {
    @ApiProperty()
    @IsString()
    slug: string;

    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    price: number;

    @ApiProperty()
    @IsString()
    sku: string;

    @ApiProperty()
    weight: number;

    @ApiProperty()
    discountedPrice: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    status?: boolean;

    @ApiProperty()
    quantity: number;

    @ApiProperty()
    variation: any;

    @ApiProperty()
    files: File;
}
