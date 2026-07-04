import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { School } from 'generated/prisma/client';
import { CreateSchoolDto } from './dto/create-school.dto';
import { SchoolsService, SchoolWithRelations } from './school.service';

@Controller()
export class SchoolsController {
  constructor(private readonly schoolsService: SchoolsService) {}

  @Get()
  async getSchools(): Promise<SchoolWithRelations[]> {
    return this.schoolsService.schools();
  }

  @Get(':schoolId')
  async getSchool(
    @Param('schoolId', ParseIntPipe) schoolId: number,
  ): Promise<SchoolWithRelations> {
    const school = await this.schoolsService.school(schoolId);
    if (!school) {
      throw new NotFoundException('School not found');
    }
    return school;
  }

  @Post()
  async createSchool(
    @Body() createSchoolDto: CreateSchoolDto,
  ): Promise<School> {
    return this.schoolsService.createSchool(createSchoolDto);
  }
}
