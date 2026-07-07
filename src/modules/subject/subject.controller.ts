import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import {
  SubjectWithCategory,
  SubjectsService,
} from './subject.service';
import { AuthenticatedUser } from '../auth/strategies/jwt.strategy';

@Controller()
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Get()
  async getSubjects(
    @Request() req: { user: AuthenticatedUser },
  ): Promise<SubjectWithCategory[]> {
    return this.subjectsService.subjectsBySchool(req.user.schoolId);
  }

  @Post()
  async createSubject(
    @Request() req: { user: AuthenticatedUser },
    @Body() createSubjectDto: CreateSubjectDto,
  ): Promise<SubjectWithCategory> {
    return this.subjectsService.createSubject(
      req.user.schoolId,
      createSubjectDto,
    );
  }
}
