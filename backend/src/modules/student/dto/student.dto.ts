import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsNumber,
  IsOptional,
  IsArray,
  IsEnum,
  IsStrongPassword,
  ArrayNotEmpty,
  IsMongoId,
} from 'class-validator';
import { Level } from '../student.schema';


export class CreateStudentDto{
    @IsString()
    @MinLength(2)
    @MaxLength(100)
    firstName!: string;

    @IsString()
    @MinLength(2)
    @MaxLength(100)
    lastName!: string;

    @IsEmail()
    email!: string;

    @IsString()
    @MinLength(3)
    @MaxLength(20)
    username!: string;

    @IsString()
    department!: string;

    @IsString()
    faculty!: string;

    @IsString()
    @IsStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minNumbers: 1,
        minSymbols: 1,
        minUppercase: 1
    }, { message: 'Password is to weak' })
    @MinLength(8, { message: 'password must be at least 8 characters long!' })
    password!: string

    @IsEnum(Level)
    level!: Level

    @IsNumber()
    gpa!: number;

    @IsString()
    semester!: string;

}

export class UpdateStudentDto{
    @IsString()
    @MinLength(2)
    @MaxLength(100)
    firstName?: string;

    @IsString()
    @MinLength(2)
    @MaxLength(100)
    lastName?: string;

    @IsEmail()
    email?: string;

    @IsString()
    @MinLength(3)
    @MaxLength(20)
    username?: string;

    @IsString()
    department?: string;

    @IsString()
    faculty?: string;

    @IsString()
    @IsStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minNumbers: 1,
        minSymbols: 1,
        minUppercase: 1
    }, { message: 'Password is to weak' })
    @MinLength(8, { message: 'password must be at least 8 characters long!' })
    password?: string

    @IsEnum(Level)
    level?: Level

    @IsNumber()
    gpa?: number;

    @IsString()
    semester?: string;

    @IsArray()
    @ArrayNotEmpty()
    @IsMongoId({ each: true })
    enrolledCourses?: string[];
}