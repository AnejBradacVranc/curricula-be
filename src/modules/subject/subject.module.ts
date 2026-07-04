import { Module } from '@nestjs/common';
import { SubjectsController } from './subject.controller';
import { SubjectsService } from './subject.service';

@Module({
  controllers: [SubjectsController],
  providers: [SubjectsService],
})
export class SubjectsModule {}
