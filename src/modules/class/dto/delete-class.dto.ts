import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty } from 'class-validator';

export class DeleteClassDto {
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  id: number;

  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  programId: number;

  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  yearId: number;
}
