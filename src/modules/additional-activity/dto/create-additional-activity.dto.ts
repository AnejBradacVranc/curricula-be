import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAdditionalActivityDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
