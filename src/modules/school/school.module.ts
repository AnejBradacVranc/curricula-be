import { Module } from '@nestjs/common';
import { SchoolsController } from './school.controller';
import { SchoolsService } from './school.service';

@Module({
  controllers: [SchoolsController],
  providers: [SchoolsService], //Here put Services that will be injected in that specific controller
})
export class SchoolsModule {}
