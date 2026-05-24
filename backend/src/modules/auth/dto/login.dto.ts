import { IsEmail, IsString, IsStrongPassword, MinLength } from 'class-validator';

export class LoginDto{
    @IsEmail()
    email!: string;

    @IsString()
    @MinLength(6, { message: 'password must be at least 8 characters long!' })
    password!: string;
}