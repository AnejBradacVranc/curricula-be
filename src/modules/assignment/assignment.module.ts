import { Module } from '@nestjs/common';
import { AssignmentsController } from './assignment.controller';
import { AssignmentsService } from './assignment.service';

@Module({
  controllers: [AssignmentsController],
  providers: [AssignmentsService],
})
export class AssignmentsModule {}
