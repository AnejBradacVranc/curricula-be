import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Teacher } from 'generated/prisma/client';
import { BunnyCDNService } from 'src/core/cdn/bunny.service';
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
  constructor(
    private readonly prisma: PrismaService,
    private readonly cdnService: BunnyCDNService,
  ) {}

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
    profileImage?: Express.Multer.File,
  ): Promise<Teacher> {
    const assignedHours = new Prisma.Decimal(data.assignedHours);

    // Create first so we have a stable teacher id for the CDN object key.
    const teacher = await this.prisma.teacher.create({
      data: {
        ...data,
        assignedHours,
        additionalActivityHours: 0,
        totalHours: assignedHours,
        school: { connect: { id: schoolId } },
      },
    });

    if (!profileImage) {
      return teacher;
    }

    const profileImageUrl = await this.cdnService.uploadImageToFolder(
      schoolId,
      'teachers',
      `teacher-${teacher.id}`,
      profileImage,
    );

    return this.prisma.teacher.update({
      where: { id: teacher.id },
      data: { profileImage: profileImageUrl },
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
    profileImage?: Express.Multer.File | null,
  ): Promise<TeacherDetailDto> {
    const teacher = await this.prisma.teacher.findFirst({
      where: { id: teacherId, schoolId },
    });

    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    const profileImageUrl = profileImage
      ? await this.cdnService.uploadImageToFolder(
          schoolId,
          'teachers',
          `teacher-${teacherId}`,
          profileImage,
        )
      : profileImage;

    if (profileImageUrl === null && teacher.profileImage) {
      const storagePath = new URL(teacher.profileImage).pathname;
      await this.cdnService.removeFile(storagePath);
    }

    const color =
      data.color == null || data.color === '' ? null : data.color.trim();

    // Avoid update+nested select in one call: @prisma/adapter-pg can issue
    // concurrent queries on a single connection (pg deprecation warning).
    await this.prisma.teacher.update({
      where: { id: teacherId },
      data: {
        name: data.name.trim(),
        surname: data.surname.trim(),
        email: data.email.trim().toLowerCase(),
        color,
        ...(profileImageUrl !== undefined
          ? { profileImage: profileImageUrl }
          : {}),
        updatedAt: new Date(),
      },
    });

    return this.prisma.teacher.findFirstOrThrow({
      where: { id: teacherId, schoolId },
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
