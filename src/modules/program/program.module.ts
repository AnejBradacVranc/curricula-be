import { Module } from '@nestjs/common';
import { ProgramsController } from './program.controller';
import { ProgramsService } from './program.service';

@Module({
  controllers: [ProgramsController],
  providers: [ProgramsService],
})
export class ProgramsModule {}
