import { Module } from '@nestjs/common';
import { ClassesController } from './class.controller';
import { ClassesService } from './class.service';

@Module({
  controllers: [ClassesController],
  providers: [ClassesService],
})
export class ClassesModule {}
