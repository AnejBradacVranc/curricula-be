import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class CreateAssignmentDto {
  @Type(() => Number)
  @IsInt()
  subjectId: number;

  @Type(() => Number)
  @IsInt()
  teacherId: number;

  //@IsOptional()
  //@Type(() => Number)
  //@IsInt()
  //assignedHours?: number;
}
