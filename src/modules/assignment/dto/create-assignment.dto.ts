import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class CreateAssignmentDto {
  @Type(() => Number)
  @IsInt()
  subjectId: number;

  @Type(() => Number)
  @IsInt()
  teacherId: number;

  @Type(() => Number)
  @IsInt()
  programId: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  yearId: number;
}
