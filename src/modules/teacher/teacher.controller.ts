import { Body, Controller, Get, Post } from '@nestjs/common';
import { Prisma, Teacher } from 'generated/prisma/client';
import { TeachersService } from './teacher.service';

@Controller('teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Get()
  async getTeachers(): Promise<Teacher[] | null> {
    return this.teachersService.teachers();
  }

  @Post()
  async createTeacher(
    @Body() createTeacherDto: Prisma.TeacherCreateInput,
  ): Promise<Teacher> {
    return this.teachersService.createTeacher(createTeacherDto);
  }
}
