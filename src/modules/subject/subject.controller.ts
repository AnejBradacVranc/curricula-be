import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { Subject } from 'generated/prisma/client';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { SubjectsService } from './subject.service';

@Controller()
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Get()
  async getSubjects(
    @Param('schoolId', ParseIntPipe) schoolId: number,
  ): Promise<Subject[]> {
    return this.subjectsService.subjectsBySchool(schoolId);
  }

  @Post()
  async createSubject(
    @Param('schoolId', ParseIntPipe) schoolId: number,
    @Body() createSubjectDto: CreateSubjectDto,
  ): Promise<Subject> {
    return this.subjectsService.createSubject(schoolId, createSubjectDto);
  }
}
