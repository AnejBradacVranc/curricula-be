import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Teacher } from 'generated/prisma/client';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { CreateTeachersDto } from './dto/create-teachers.dto';
import { TeacherDetailDto } from './dto/teacher-detail.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { TeachersService } from './teacher.service';
import { AuthenticatedUser } from '../auth/strategies/jwt.strategy';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageValidationPipe } from 'src/core/validation/imageValidationPipe';

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
  @UseInterceptors(FileInterceptor('file'))
  async createTeacher(
    @Request() req: { user: AuthenticatedUser },
    @Body() createTeacherDto: CreateTeacherDto,
    @UploadedFile(new ImageValidationPipe({ optional: true }))
    profileImage?: Express.Multer.File,
  ): Promise<Teacher> {
    return this.teachersService.createTeacher(
      req.user.schoolId,
      createTeacherDto,
      profileImage,
    );
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  async updateTeacher(
    @Request() req: { user: AuthenticatedUser },
    @Param('id') id: number,
    @Body() updateTeacherDto: UpdateTeacherDto,
    @UploadedFile(new ImageValidationPipe({ optional: true }))
    profileImage?: Express.Multer.File | null,
  ): Promise<TeacherDetailDto> {
    return this.teachersService.updateTeacher(
      req.user.schoolId,
      id,
      updateTeacherDto,
      updateTeacherDto.removeProfileImage ? null : profileImage,
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
