import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class DeleteProgramYearDto {
  @Type(() => Number)
  @IsInt()
  programId: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  yearId: number;
}
