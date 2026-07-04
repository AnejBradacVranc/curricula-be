import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateProgramDto {
  @Type(() => Number)
  @IsInt()
  schoolId: number;

  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  availableHours: number;
}
