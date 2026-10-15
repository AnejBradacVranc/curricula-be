import { Body, Controller, Get, Patch, Post, Request } from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
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

  @Patch()
  async updateSubject(
    @Request() req: { user: AuthenticatedUser },
    @Body() updateSubjectDto: UpdateSubjectDto,
  ): Promise<SubjectWithCategory> {
    return this.subjectsService.updateSubject(
      req.user.schoolId,
      updateSubjectDto,
    );
  }
}
