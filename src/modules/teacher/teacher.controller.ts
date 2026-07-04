import { Body, Controller, Get, Post } from '@nestjs/common';
import { Teacher } from 'generated/prisma/client';
import { CreateTeacherDto } from './dto/create-teacher.dto';
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
    @Body() createTeacherDto: CreateTeacherDto,
  ): Promise<Teacher> {
    return this.teachersService.createTeacher(createTeacherDto);
  }
}
