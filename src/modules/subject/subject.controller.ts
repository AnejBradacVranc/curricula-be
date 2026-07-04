import { Body, Controller, Get, Post } from '@nestjs/common';
import { Prisma, Subject } from 'generated/prisma/client';
import { SubjectsService } from './subject.service';

@Controller('subjects')
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Get()
  async subjects(): Promise<Subject[] | null> {
    return this.subjectsService.subjects();
  }

  @Post()
  async createSubject(
    @Body() createSubjectDto: Prisma.SubjectCreateInput,
  ): Promise<Subject> {
    return this.subjectsService.createSubject(createSubjectDto);
  }
}
