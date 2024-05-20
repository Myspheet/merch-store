import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean } from "class-validator";

export class CreateNotificationDto {
    @ApiPropertyOptional()
    @IsBoolean()
    transactionAlert?: boolean;

    @ApiPropertyOptional()
    @IsBoolean()
    lowStockAlert?: boolean;

    @ApiPropertyOptional()
    @IsBoolean()
    exclusiveOffer?: boolean;

    @ApiPropertyOptional()
    @IsBoolean()
    emailNotification?: boolean;

    @ApiPropertyOptional()
    @IsBoolean()
    pushNotification?: boolean;

    @ApiPropertyOptional()
    @IsBoolean()
    smsNotification?: boolean;
}
