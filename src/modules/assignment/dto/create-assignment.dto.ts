import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

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

  //@IsOptional()
  //@Type(() => Number)
  //@IsInt()
  //assignedHours?: number;
}
