import { Body, Controller, Delete, Post, Request } from '@nestjs/common';
import {
  AdditionalActivityAssignmentService,
  AdditionalActivityAssignmentWithRelations,
} from './additional-activity-assignment.service';
import { CreateAdditionalActivityAssignmentDto } from './dto/create-additional-activity-assignment.dto';
import { DeleteAdditionalActivityAssignmentDto } from './dto/delete-additional-activity-assignment.dto';
import { AuthenticatedUser } from '../auth/strategies/jwt.strategy';

@Controller()
export class AdditionalActivityAssignmentController {
  constructor(
    private readonly additionalActivityAssignmentService: AdditionalActivityAssignmentService,
  ) {}

  @Post()
  async createAssignment(
    @Request() req: { user: AuthenticatedUser },
    @Body() createDto: CreateAdditionalActivityAssignmentDto,
  ): Promise<AdditionalActivityAssignmentWithRelations> {
    return this.additionalActivityAssignmentService.upsertAssignment(
      req.user.schoolId,
      createDto,
    );
  }

  @Delete()
  async deleteAssignment(
    @Request() req: { user: AuthenticatedUser },
    @Body() deleteDto: DeleteAdditionalActivityAssignmentDto,
  ): Promise<void> {
    return this.additionalActivityAssignmentService.deleteAssignment(
      req.user.schoolId,
      deleteDto,
    );
  }
}
