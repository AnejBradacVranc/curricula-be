import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class UpdateAdditionalActivityDto {
  @Type(() => Number)
  @IsInt()
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;
}
