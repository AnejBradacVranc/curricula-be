import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

export class ImportProgramSubjectDto {
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 4 })
  @IsNotEmpty()
  requiredHours: number;

  /** Link an existing subject. Omit (or null) when creating a new one. */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  subjectId?: number | null;

  @ValidateIf((o: ImportProgramSubjectDto) => o.subjectId == null)
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ValidateIf((o: ImportProgramSubjectDto) => o.subjectId == null)
  @IsString()
  @IsNotEmpty()
  abbrevation?: string;

  @ValidateIf((o: ImportProgramSubjectDto) => o.subjectId == null)
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  categoryId?: number;
}

export class ImportProgramYearDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  yearId: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  numWeeks: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImportProgramSubjectDto)
  subjects: ImportProgramSubjectDto[];
}

export class ImportProgramDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ImportProgramYearDto)
  years: ImportProgramYearDto[];
}
