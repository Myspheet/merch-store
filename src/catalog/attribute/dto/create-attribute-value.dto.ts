import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class AttributeValue {
    @ApiProperty()
    @IsString()
    value: string;

    @ApiPropertyOptional()
    @IsString()
    code?: string;

    @ApiPropertyOptional()
    @IsString()
    imageUrl?: string;
}

export class CreateAttributeValueDto {
    attributeValues: AttributeValue[];
}
