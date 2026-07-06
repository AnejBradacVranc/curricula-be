import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class DeleteAssignmentDto {
  @Type(() => Number)
  @IsInt()
  classId: number;

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
