import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { Teacher } from 'generated/prisma/client';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { TeachersService } from './teacher.service';

@Controller()
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Get()
  async getTeachers(
    @Param('schoolId', ParseIntPipe) schoolId: number,
  ): Promise<Teacher[]> {
    return this.teachersService.teachersBySchool(schoolId);
  }

  @Post()
  async createTeacher(
    @Param('schoolId', ParseIntPipe) schoolId: number,
    @Body() createTeacherDto: CreateTeacherDto,
  ): Promise<Teacher> {
    return this.teachersService.createTeacher(schoolId, createTeacherDto);
  }
}
