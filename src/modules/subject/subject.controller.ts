import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { Subject } from 'generated/prisma/client';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { SubjectsService } from './subject.service';
import { AuthenticatedUser } from '../auth/strategies/jwt.strategy';

@Controller()
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Get()
  async getSubjects(
    @Request() req: { user: AuthenticatedUser },
  ): Promise<Subject[]> {
    return this.subjectsService.subjectsBySchool(req.user.schoolId);
  }

  @Post()
  async createSubject(
    @Request() req: { user: AuthenticatedUser },
    @Body() createSubjectDto: CreateSubjectDto,
  ): Promise<Subject> {
    return this.subjectsService.createSubject(
      req.user.schoolId,
      createSubjectDto,
    );
  }
}
