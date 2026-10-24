import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  ValidateIf,
} from 'class-validator';

export class CreateTeacherDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  surname: string;

  @IsOptional()
  @ValidateIf((_, value) => value != null && value !== '')
  @IsEmail()
  email?: string | null;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 4 })
  @IsNotEmpty()
  assignedHours: number;

  @IsOptional()
  @IsString()
  @Matches(/^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/, {
    message: 'Color must be in format #RRGGBB or #RGB.',
  })
  color?: string;
}
