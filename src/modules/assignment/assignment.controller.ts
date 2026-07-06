import { Body, Controller, Delete, Post, Request } from '@nestjs/common';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import {
  AssignedClassSubject,
  AssignmentsService,
} from './assignment.service';
import { DeleteAssignmentDto } from './dto/delete-assignment.dto';
import { AuthenticatedUser } from '../auth/strategies/jwt.strategy';

@Controller()
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Post()
  async createAssignment(
    @Request() req: { user: AuthenticatedUser },
    @Body() createAssignmentDto: CreateAssignmentDto,
  ): Promise<AssignedClassSubject> {
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
