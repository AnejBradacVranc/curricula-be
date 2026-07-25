import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Request,
} from '@nestjs/common';
import { ProgramSubject } from 'generated/prisma/client';
import { CreateProgramSubjectDto } from './dto/create-program-subject.dto';
import { DeleteProgramSubjectDto } from './dto/delete-program-subject.dto';
import { UpdateProgramSubjectDto } from './dto/update-program-subject.dto';
import {
  ProgramSubjectsService,
  ProgramSubjectWithRelations,
} from './program-subject.service';
import { AuthenticatedUser } from '../auth/strategies/jwt.strategy';

@Controller()
export class ProgramSubjectsController {
  constructor(
    private readonly programSubjectsService: ProgramSubjectsService,
  ) {}

  @Get()
  async getProgramSubjects(
    @Request() req: { user: AuthenticatedUser },
  ): Promise<ProgramSubjectWithRelations[]> {
    return this.programSubjectsService.programSubjectsBySchool(
      req.user.schoolId,
    );
  }

  @Post()
  async createProgramSubject(
    @Request() req: { user: AuthenticatedUser },
    @Body() createProgramSubjectDto: CreateProgramSubjectDto,
  ): Promise<ProgramSubject> {
    return this.programSubjectsService.createProgramSubject(
      req.user.schoolId,
      createProgramSubjectDto,
    );
  }

  @Patch()
  async updateProgramSubject(
    @Request() req: { user: AuthenticatedUser },
    @Body() updateProgramSubjectDto: UpdateProgramSubjectDto,
  ): Promise<ProgramSubjectWithRelations> {
    return this.programSubjectsService.updateProgramSubject(
      req.user.schoolId,
      updateProgramSubjectDto,
    );
  }

  @Delete()
  async deleteProgramSubject(
    @Request() req: { user: AuthenticatedUser },
    @Body() deleteProgramSubjectDto: DeleteProgramSubjectDto,
  ): Promise<void> {
    return this.programSubjectsService.deleteProgramSubject(
      req.user.schoolId,
      deleteProgramSubjectDto,
    );
  }
}
