import { Module } from '@nestjs/common';
import { AdditionalActivityAssignmentController } from './additional-activity-assignment.controller';
import { AdditionalActivityAssignmentService } from './additional-activity-assignment.service';

@Module({
  controllers: [AdditionalActivityAssignmentController],
  providers: [AdditionalActivityAssignmentService],
})
export class AdditionalActivityAssignmentModule {}
