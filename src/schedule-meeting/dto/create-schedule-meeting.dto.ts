import { IsString, IsEmail, IsISO8601 } from 'class-validator';

export class CreateScheduleMeetingDto {

    @IsString()
    code: string

    @IsString()
    name: string;

 
    @IsString()
    location: string;

    @IsEmail()
    email: string;

    @IsISO8601()
    dateTime: string;
}
