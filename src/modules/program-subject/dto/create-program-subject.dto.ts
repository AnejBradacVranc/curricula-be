import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateProgramSubjectDto {
  @Type(() => Number)
  @IsInt()
  programId: number;

  @Type(() => Number)
  @IsInt()
  subjectId: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  yearId: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsNotEmpty()
  requiredHours: number;
}
