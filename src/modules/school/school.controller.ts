import { Body, Controller, Get, Post } from '@nestjs/common';
import { SchoolsService } from './school.service';
import { School, Prisma } from 'generated/prisma/client';

@Controller('schools')
export class SchoolsController {
  constructor(private readonly schoolsService: SchoolsService) {}

  @Get()
  async getSchools(): Promise<School[] | null> {
    return this.schoolsService.schools();
  }

  @Post()
  async createSchool(
    @Body() createSchoolDto: Prisma.SchoolCreateInput,
  ): Promise<School> {
    return this.schoolsService.createSchool(createSchoolDto);
  }
}
