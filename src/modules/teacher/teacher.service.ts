import { Injectable } from '@nestjs/common';
import { Prisma, Teacher } from 'generated/prisma/client';
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
      orderBy: [{ name: 'asc' }, { surname: 'asc' }],
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
    const assignedHours = new Prisma.Decimal(data.assignedHours);

    return this.prisma.teacher.create({
      data: {
        ...data,
        assignedHours,
        additionalActivityHours: 0,
        totalHours: assignedHours,
        school: { connect: { id: schoolId } },
      },
    });
  }
}
