import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateAdditionalActivityAssignmentDto {
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  teacherId: number;

  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  additionalActivityId: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 4 })
  @Min(0)
  @IsNotEmpty()
  hoursAmount: number;
}
