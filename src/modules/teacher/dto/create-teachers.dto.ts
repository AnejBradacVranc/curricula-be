import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';
import { CreateTeacherDto } from './create-teacher.dto';

export class CreateTeachersDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateTeacherDto)
  teachers: CreateTeacherDto[];
}
