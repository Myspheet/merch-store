import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateAttributeDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    attributeName: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    attributeCode: string;
}
