import { Body, Controller, Get, Post } from '@nestjs/common';
import { SubjectTeacher } from 'generated/prisma/client';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import {
  AssignmentsService,
  AssignmentWithRelations,
} from './assignment.service';

@Controller('assignments')
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Get()
  async getAssignments(): Promise<AssignmentWithRelations[]> {
    return this.assignmentsService.assignments();
  }

  @Post()
  async createAssignment(
    @Body() createAssignmentDto: CreateAssignmentDto,
  ): Promise<SubjectTeacher> {
    return this.assignmentsService.createAssignment(createAssignmentDto);
  }
}
