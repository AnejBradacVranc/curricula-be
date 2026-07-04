import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSchoolDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  tel?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  address?: string;
}
