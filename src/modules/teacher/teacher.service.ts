import { Injectable } from '@nestjs/common';
import { Teacher } from 'generated/prisma/client';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import {
  TeacherDetailDto,
  teacherDetailSelect,
} from './dto/teacher-detail.dto';

@Injectable()
export class TeachersService {
  constructor(private readonly prisma: PrismaService) {}

  async teachersBySchool(schoolId: number): Promise<Teacher[]> {
    return this.prisma.teacher.findMany({
      where: { schoolId },
    });
  }

  async teacherById(
    schoolId: number,
    teacherId: number,
  ): Promise<TeacherDetailDto | null> {
    return this.prisma.teacher.findFirst({
      where: { id: teacherId, schoolId },
      select: teacherDetailSelect,
    });
  }

  async createTeacher(
    schoolId: number,
    data: CreateTeacherDto,
  ): Promise<Teacher> {
    return this.prisma.teacher.create({
      data: {
        ...data,
        school: { connect: { id: schoolId } },
      },
    });
  }
}
