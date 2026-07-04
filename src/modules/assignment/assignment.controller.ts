import { Controller, Get } from '@nestjs/common';
import { SubjectTeacher } from 'generated/prisma/client';
import { AssignmentsService } from './assignment.service';

@Controller('assignments')
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Get()
  async getAssignments(): Promise<SubjectTeacher[] | null> {
    return this.assignmentsService.getAssignments();
  }
}
