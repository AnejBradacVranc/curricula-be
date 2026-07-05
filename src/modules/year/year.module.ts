import { Module } from '@nestjs/common';
import { YearsController } from './year.controller';
import { YearsService } from './year.service';

@Module({
  controllers: [YearsController],
  providers: [YearsService],
})
export class YearsModule {}
