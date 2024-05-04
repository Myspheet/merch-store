import { ApiProperty } from "@nestjs/swagger";

export class GoogleSigninDto {
    name?: string;
    email: string;
    photo_url?: string;
    signin_provider?: string;
}
