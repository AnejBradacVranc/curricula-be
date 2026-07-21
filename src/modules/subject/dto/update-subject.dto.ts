import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class UpdateSubjectDto {
  @Type(() => Number)
  @IsInt()
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  categoryId: number;

  @IsString()
  @IsNotEmpty()
  abbrevation: string;
}
