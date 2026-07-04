import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { SubjectTeacher } from 'generated/prisma/client';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import {
  AssignmentsService,
  AssignmentWithRelations,
} from './assignment.service';

@Controller()
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Get()
  async getAssignments(
    @Param('schoolId', ParseIntPipe) schoolId: number,
  ): Promise<AssignmentWithRelations[]> {
    return this.assignmentsService.assignmentsBySchool(schoolId);
  }

  @Post()
  async createAssignment(
    @Param('schoolId', ParseIntPipe) schoolId: number,
    @Body() createAssignmentDto: CreateAssignmentDto,
  ): Promise<SubjectTeacher> {
    return this.assignmentsService.createAssignment(
      schoolId,
      createAssignmentDto,
    );
  }
}
