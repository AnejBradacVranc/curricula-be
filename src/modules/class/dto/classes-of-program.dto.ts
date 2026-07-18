import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class ClassesOfProgramDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  programId?: number;
}
