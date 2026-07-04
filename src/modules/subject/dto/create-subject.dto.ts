import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateSubjectDto {
  @Type(() => Number)
  @IsInt()
  programId: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  requiredHours: number;
}
