import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class DeleteAdditionalActivityDto {
  @Type(() => Number)
  @IsInt()
  id: number;
}
