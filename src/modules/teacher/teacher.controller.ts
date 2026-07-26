import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
} from '@nestjs/common';
import { Teacher } from 'generated/prisma/client';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { CreateTeachersDto } from './dto/create-teachers.dto';
import { TeacherDetailDto } from './dto/teacher-detail.dto';
import { TeachersService } from './teacher.service';
import { AuthenticatedUser } from '../auth/strategies/jwt.strategy';

@Controller()
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Get()
  async getTeachers(
    @Request() req: { user: AuthenticatedUser },
  ): Promise<Teacher[]> {
    return this.teachersService.teachersBySchool(req.user.schoolId);
  }

  @Post('bulk')
  async createTeachers(
    @Request() req: { user: AuthenticatedUser },
    @Body() createTeachersDto: CreateTeachersDto,
  ): Promise<Teacher[]> {
    return this.teachersService.createTeachers(
      req.user.schoolId,
      createTeachersDto,
    );
  }

  @Get(':id')
  async getTeacher(
    @Request() req: { user: AuthenticatedUser },
    @Param('id') id: number,
  ): Promise<TeacherDetailDto | null> {
    return this.teachersService.teacherById(req.user.schoolId, id);
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

  @Delete(':id')
  async deleteTeacher(
    @Request() req: { user: AuthenticatedUser },
    @Param('id') id: number,
  ): Promise<Teacher> {
    return this.teachersService.deleteTeacher(req.user.schoolId, id);
  }
}
