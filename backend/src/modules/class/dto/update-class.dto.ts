import{ IsString, IsNotEmpty } from 'class-validator';

export class UpdateClassDto{
    @IsString()
    @IsNotEmpty()
    course?: string;

    @IsString()
    professor?: string;

    @IsString()
    venue?: string;

    @IsString()
    date?: string;

    @IsString()
    schedule?: string;

    @IsString()
    time?: string;
}