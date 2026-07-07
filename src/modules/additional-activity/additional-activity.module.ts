import { Module } from '@nestjs/common';
import { AdditionalActivityController } from './additional-activity.controller';
import { AdditionalActivityService } from './additional-activity.service';

@Module({
  controllers: [AdditionalActivityController],
  providers: [AdditionalActivityService],
})
export class AdditionalActivityModule {}
