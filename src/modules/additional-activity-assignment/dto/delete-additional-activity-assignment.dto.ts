import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty } from 'class-validator';

export class DeleteAdditionalActivityAssignmentDto {
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  teacherId: number;

  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  additionalActivityId: number;
}
