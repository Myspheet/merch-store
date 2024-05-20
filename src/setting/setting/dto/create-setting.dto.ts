import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateSettingDto {
    @ApiProperty()
    @IsString()
    language: string;

    @ApiProperty()
    @IsString()
    currency: string;

    @ApiProperty()
    @IsString()
    timezone: string;

    @ApiProperty()
    @IsString()
    dateFormat: string;
}
