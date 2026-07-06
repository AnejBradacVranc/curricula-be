import { IsIn, IsOptional } from 'class-validator';

export class GetProgramsQueryDto {
  @IsOptional()
  @IsIn(['flat', 'byClass'])
  view?: 'flat' | 'byClass';
}
