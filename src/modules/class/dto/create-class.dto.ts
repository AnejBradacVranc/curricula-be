import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateClassDto {
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  programId: number;

  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  yearId: number;

  @IsString()
  @IsNotEmpty()
  label: string;
}
