import { IsNotEmpty, IsString } from "class-validator";

export class CreateAttributeDto {
    @IsString()
    @IsNotEmpty()
    attributeName: string;

    @IsString()
    @IsNotEmpty()
    attributeCode: string;
}
