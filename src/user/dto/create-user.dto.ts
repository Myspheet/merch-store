import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, MinLength } from "class-validator";


export class CreateUserDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsString()
    @IsStrongPassword()
    @MinLength(6)
    password

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;
}
