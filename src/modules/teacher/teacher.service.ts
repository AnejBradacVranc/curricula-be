import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Teacher } from 'generated/prisma/client';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { CreateTeachersDto } from './dto/create-teachers.dto';
import {
  TeacherDetailDto,
  teacherDetailSelect,
} from './dto/teacher-detail.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';

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

  async createTeachers(
    schoolId: number,
    data: CreateTeachersDto,
  ): Promise<Teacher[]> {
    return this.prisma.teacher.createManyAndReturn({
      data: data.teachers.map((teacher) => {
        const assignedHours = new Prisma.Decimal(teacher.assignedHours);

        return {
          name: teacher.name.trim(),
          surname: teacher.surname.trim(),
          email: teacher.email.trim().toLowerCase(),
          color: teacher.color,
          schoolId,
          assignedHours,
          additionalActivityHours: 0,
          totalHours: assignedHours,
        };
      }),
    });
  }

  async updateTeacher(
    schoolId: number,
    teacherId: number,
    data: UpdateTeacherDto,
  ): Promise<TeacherDetailDto> {
    const teacher = await this.prisma.teacher.findFirst({
      where: { id: teacherId, schoolId },
    });

    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    const color =
      data.color == null || data.color === '' ? null : data.color.trim();

    return this.prisma.teacher.update({
      where: { id: teacherId },
      data: {
        name: data.name.trim(),
        surname: data.surname.trim(),
        email: data.email.trim().toLowerCase(),
        color,
        updatedAt: new Date(),
      },
      select: teacherDetailSelect,
    });
  }

  async deleteTeacher(schoolId: number, teacherId: number): Promise<Teacher> {
    const teacher = await this.prisma.teacher.findFirst({
      where: { id: teacherId, schoolId },
    });

    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.classSubjectAssignment.deleteMany({
        where: { teacherId },
      });
      await tx.additionalTeacherAssignment.deleteMany({
        where: { teacherId },
      });
      return tx.teacher.delete({
        where: { id: teacherId },
      });
    });
  }
}
