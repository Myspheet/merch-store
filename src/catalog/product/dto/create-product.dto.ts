import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateProductDto {
    @ApiProperty()
    slug: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    price: number;

    @ApiProperty()
    sku: string;

    @ApiProperty()
    weight: number;

    @ApiProperty()
    discountedPrice: number;

    @ApiPropertyOptional()
    status?: boolean;

    @ApiProperty()
    quantity: number;

    @ApiProperty({ type: [String] })
    variation: any;
}
