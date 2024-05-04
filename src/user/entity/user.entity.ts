export class UserEntity {
    id?: number;
    email: string;
    name?: string;
    phone_number?: string;
    password?: string;
    signin_provider?: string;
    refresh_token?: string;
    photo_url?: string;
}