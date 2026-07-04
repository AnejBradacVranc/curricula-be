import { Body, Controller, Get, Post } from '@nestjs/common';
import { Subject } from 'generated/prisma/client';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { SubjectsService } from './subject.service';

@Controller('subjects')
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Get()
  async getSubjects(): Promise<Subject[] | null> {
    return this.subjectsService.subjects();
  }

  @Post()
  async createSubject(
    @Body() createSubjectDto: CreateSubjectDto,
  ): Promise<Subject> {
    return this.subjectsService.createSubject(createSubjectDto);
  }
}
