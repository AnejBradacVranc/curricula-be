import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty } from 'class-validator';

export class DeleteProgramSubjectDto {
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  programId: number;

  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  subjectId: number;

  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  yearId: number;
}
