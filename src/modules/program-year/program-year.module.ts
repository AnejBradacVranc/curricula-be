import { Module } from '@nestjs/common';
import { ProgramYearsController } from './program-year.controller';
import { ProgramYearsService } from './program-year.service';

@Module({
  controllers: [ProgramYearsController],
  providers: [ProgramYearsService],
})
export class ProgramYearsModule {}
