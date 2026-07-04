import { Body, Controller, Get, Post } from '@nestjs/common';
import { Prisma, SubjectTeacher } from 'generated/prisma/client';
import { AssignmentsService } from './assignment.service';

@Controller('assignments')
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Get()
  async assignments(): Promise<SubjectTeacher[] | null> {
    return this.assignmentsService.assignments();
  }

  @Post()
  async createAssignment(
    @Body() createAssignmentDto: Prisma.SubjectTeacherCreateInput,
  ): Promise<SubjectTeacher> {
    return this.assignmentsService.createAssignment(createAssignmentDto);
  }
}
