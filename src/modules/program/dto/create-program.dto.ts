import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateProgramDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  availableHours: number;
}
