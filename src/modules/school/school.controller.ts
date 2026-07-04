import { Body, Controller, Get, Post } from '@nestjs/common';
import { School } from 'generated/prisma/client';
import { CreateSchoolDto } from './dto/create-school.dto';
import { SchoolsService } from './school.service';

@Controller('schools')
export class SchoolsController {
  constructor(private readonly schoolsService: SchoolsService) {}

  @Get()
  async getSchools(): Promise<School[] | null> {
    return this.schoolsService.schools();
  }

  @Post()
  async createSchool(
    @Body() createSchoolDto: CreateSchoolDto,
  ): Promise<School> {
    return this.schoolsService.createSchool(createSchoolDto);
  }
}
