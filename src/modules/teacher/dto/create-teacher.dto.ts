import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateTeacherDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  surname: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}
