import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ProgramSubject } from 'generated/prisma/client';
import { CreateProgramSubjectDto } from './dto/create-program-subject.dto';
import {
  ProgramSubjectsService,
  ProgramSubjectWithRelations,
} from './program-subject.service';

@Controller()
export class ProgramSubjectsController {
  constructor(
    private readonly programSubjectsService: ProgramSubjectsService,
  ) {}

  @Get()
  async getProgramSubjects(
    @Param('schoolId', ParseIntPipe) schoolId: number,
  ): Promise<ProgramSubjectWithRelations[]> {
    return this.programSubjectsService.programSubjectsBySchool(schoolId);
  }

  @Post()
  async createProgramSubject(
    @Param('schoolId', ParseIntPipe) schoolId: number,
    @Body() createProgramSubjectDto: CreateProgramSubjectDto,
  ): Promise<ProgramSubject> {
    return this.programSubjectsService.createProgramSubject(
      schoolId,
      createProgramSubjectDto,
    );
  }
}
