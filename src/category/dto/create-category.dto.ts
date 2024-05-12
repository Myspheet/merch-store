import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateCategoryDto {
    @ApiPropertyOptional()
    slug?: string;

    @ApiProperty()
    name: string;
}
