import { Body, Controller, Delete, Get, Post, Request } from '@nestjs/common';
import { SubjectTeacher } from 'generated/prisma/client';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import {
  AssignmentsService,
  AssignmentWithRelations,
} from './assignment.service';
import { DeleteAssignmentDto } from './dto/delete-assignment.dto';
import { AuthenticatedUser } from '../auth/strategies/jwt.strategy';

@Controller()
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Get()
  async getAssignments(
    @Request() req: { user: AuthenticatedUser },
  ): Promise<AssignmentWithRelations[]> {
    return this.assignmentsService.assignmentsBySchool(req.user.schoolId);
  }

  @Post()
  async createAssignment(
    @Request() req: { user: AuthenticatedUser },
    @Body() createAssignmentDto: CreateAssignmentDto,
  ): Promise<SubjectTeacher> {
    return this.assignmentsService.createAssignment(
      req.user.schoolId,
      createAssignmentDto,
    );
  }

  @Delete()
  async deleteAssignment(
    @Request() req: { user: AuthenticatedUser },
    @Body() deleteAssignmentDto: DeleteAssignmentDto,
  ): Promise<void> {
    return this.assignmentsService.deleteAsignment(
      req.user.schoolId,
      deleteAssignmentDto,
    );
  }
}
