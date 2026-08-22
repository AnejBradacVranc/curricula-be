import { IsArray, IsInt, IsOptional } from 'class-validator';

export class ExportTeachersDto {
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  ids?: number[];
}
