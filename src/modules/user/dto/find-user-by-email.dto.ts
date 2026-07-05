import { IsEmail, IsNotEmpty } from 'class-validator';

export class FindUserByEmailDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
