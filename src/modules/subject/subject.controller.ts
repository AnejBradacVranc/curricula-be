import { Controller, Get } from '@nestjs/common';
import { Subject } from 'generated/prisma/client';
import { SubjectsService } from './subject.service';

@Controller('subjects')
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Get()
  async getSubjects(): Promise<Subject[] | null> {
    return this.subjectsService.getSubjects();
  }
}
