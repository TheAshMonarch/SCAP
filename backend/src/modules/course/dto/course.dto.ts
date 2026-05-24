import { IsString, IsNumber, IsOptional, IsNotEmpty } from "class-validator";
export class CreateCourseDto{
    @IsString()
    @IsNotEmpty()
    courseTitle!: string;

    @IsString()
    @IsNotEmpty()
    courseCode!: string;

    @IsNumber()
    credits!: number;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsNotEmpty()
    faculty!: string;
}
export class UpdateCourseDto{
    @IsString()
    @IsNotEmpty()
    courseTitle?: string;

    @IsString()
    @IsNotEmpty()
    courseCode?: string;

    @IsNumber()
    credits?: number;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsNotEmpty()
    faculty?: string;
}