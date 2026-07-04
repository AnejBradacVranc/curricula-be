import { Body, Controller, Get, Post } from '@nestjs/common';
import { ProgramSubject } from 'generated/prisma/client';
import { CreateProgramSubjectDto } from './dto/create-program-subject.dto';
import {
  ProgramSubjectsService,
  ProgramSubjectWithRelations,
} from './program-subject.service';

@Controller('program-subjects')
export class ProgramSubjectsController {
  constructor(
    private readonly programSubjectsService: ProgramSubjectsService,
  ) {}

  @Get()
  async getProgramSubjects(): Promise<ProgramSubjectWithRelations[]> {
    return this.programSubjectsService.programSubjects();
  }

  @Post()
  async createProgramSubject(
    @Body() createProgramSubjectDto: CreateProgramSubjectDto,
  ): Promise<ProgramSubject> {
    return this.programSubjectsService.createProgramSubject(
      createProgramSubjectDto,
    );
  }
}
