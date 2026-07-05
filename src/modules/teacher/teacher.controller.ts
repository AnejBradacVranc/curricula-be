import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { Teacher } from 'generated/prisma/client';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { TeachersService } from './teacher.service';
import { AuthenticatedUser } from '../auth/jwt.strategy';

@Controller()
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Get()
  async getTeachers(
    @Request() req: { user: AuthenticatedUser },
  ): Promise<Teacher[]> {
    return this.teachersService.teachersBySchool(req.user.schoolId);
  }

  @Post()
  async createTeacher(
    @Request() req: { user: AuthenticatedUser },
    @Body() createTeacherDto: CreateTeacherDto,
  ): Promise<Teacher> {
    return this.teachersService.createTeacher(
      req.user.schoolId,
      createTeacherDto,
    );
  }
}
