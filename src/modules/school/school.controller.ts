import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Request,
} from '@nestjs/common';
import { School } from 'generated/prisma/client';
import { CreateSchoolDto } from './dto/create-school.dto';
import { SchoolsService, SchoolWithRelations } from './school.service';
import { AuthenticatedUser } from '../auth/strategies/jwt.strategy';

@Controller()
export class SchoolsController {
  constructor(private readonly schoolsService: SchoolsService) {}

  @Get()
  async getSchools(): Promise<SchoolWithRelations[]> {
    return this.schoolsService.schools();
  }

  @Get('me')
  async getSchool(
    @Request() req: { user: AuthenticatedUser },
  ): Promise<SchoolWithRelations> {
    const school = await this.schoolsService.school(req.user.schoolId);
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
