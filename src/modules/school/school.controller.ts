import { Controller, Get } from '@nestjs/common';
import { SchoolsService } from './school.service';
import { School } from 'generated/prisma/client';

@Controller('schools')
export class SchoolsController {
  constructor(private readonly schoolsService: SchoolsService) {}

  @Get()
  async getSchools(): Promise<School[] | null> {
    return this.schoolsService.getSchools();
  }
}
