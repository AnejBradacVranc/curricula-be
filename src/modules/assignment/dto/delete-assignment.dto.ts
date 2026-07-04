import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class DeleteAssignmentDto {
  @Type(() => Number)
  @IsInt()
  subjectId: number;

  @Type(() => Number)
  @IsInt()
  teacherId: number;

  @Type(() => Number)
  @IsInt()
  programId: number;
}
