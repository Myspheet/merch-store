import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateCategoryDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    slug?: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;
}
