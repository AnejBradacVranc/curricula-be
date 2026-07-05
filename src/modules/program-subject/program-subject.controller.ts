import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { ProgramSubject } from 'generated/prisma/client';
import { CreateProgramSubjectDto } from './dto/create-program-subject.dto';
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
}
