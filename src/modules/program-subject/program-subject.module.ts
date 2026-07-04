import { Module } from '@nestjs/common';
import { ProgramSubjectsController } from './program-subject.controller';
import { ProgramSubjectsService } from './program-subject.service';

@Module({
  controllers: [ProgramSubjectsController],
  providers: [ProgramSubjectsService],
})
export class ProgramSubjectsModule {}
