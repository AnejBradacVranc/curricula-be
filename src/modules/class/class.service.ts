import { Injectable } from '@nestjs/common';
import { Class, Prisma } from 'generated/prisma/client';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateClassDto } from './dto/create-class.dto';
import { DeleteClassDto } from './dto/delete-class.dto';
import {
  applyTeacherHourDeltas,
  teacherAssignmentHours,
} from '../teacher/teacher-hours.util';

@Injectable()
export class ClassesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    schoolId: number,
    programId?: number | undefined,
  ): Promise<Class[]> {
    const query: Prisma.ClassWhereInput = {
      program: { schoolId },
    };

    if (programId) {
      query.programId = programId;
    }

    return this.prisma.class.findMany({
      where: query,
      orderBy: { label: 'asc' },
    });
  }

  async createClass(data: CreateClassDto): Promise<Class> {
    return this.prisma.class.create({
      data: {
        label: data.label,
        program: { connect: { id: data.programId } },
        programYear: {
          connect: {
            programId_yearId: {
              programId: data.programId,
              yearId: data.yearId,
            },
          },
        },
      },
    });
  }

  async deleteClass(schoolId: number, data: DeleteClassDto): Promise<void> {
    const { id, programId, yearId } = data;

    await this.prisma.$transaction(async (tx) => {
      const assignments = await tx.classSubjectAssignment.findMany({
        where: { classId: id, programId, yearId },
        include: {
          programSubject: { include: { programYear: true } },
        },
      });

      const deltaByTeacher = new Map<number, Prisma.Decimal>();
      for (const a of assignments) {
        const hours = teacherAssignmentHours(
          a.programSubject.requiredHours,
          a.programSubject.programYear.numWeeks,
        );
        const prev = deltaByTeacher.get(a.teacherId) ?? new Prisma.Decimal(0);
        deltaByTeacher.set(a.teacherId, prev.sub(hours));
      }

      await applyTeacherHourDeltas(tx, schoolId, deltaByTeacher);
      await tx.classSubjectAssignment.deleteMany({
        where: { classId: id, programId, yearId },
      });
      await tx.class.delete({ where: { id } });
    });
  }
}
