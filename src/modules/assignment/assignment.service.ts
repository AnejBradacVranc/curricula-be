import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';
import { PrismaService } from 'src/core/prisma/prisma.service';
import {
  syncTeacherTotalHours,
  teacherAssignmentHours,
} from '../teacher/teacher-hours.util';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { DeleteAssignmentDto } from './dto/delete-assignment.dto';

const assignmentInclude = {
  class: {
    include: {
      programYear: {
        include: {
          year: true,
        },
      },
    },
  },
  programSubject: {
    include: {
      subject: { omit: { schoolId: true }, include: { category: true } },
    },
  },
  teacher: { omit: { schoolId: true } },
} as const satisfies Prisma.ClassSubjectAssignmentInclude;

export type AssignedClassSubject = Prisma.ClassSubjectAssignmentGetPayload<{
  include: typeof assignmentInclude;
}>;

@Injectable()
export class AssignmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async createAssignment(
    schoolId: number,
    data: CreateAssignmentDto,
  ): Promise<AssignedClassSubject> {
    const { classId, subjectId, teacherId, programId, yearId } = data;

    const [teacher, programSubject, classRoom] = await Promise.all([
      this.prisma.teacher.findFirst({
        where: { id: teacherId, schoolId },
      }),
      this.prisma.programSubject.findFirst({
        where: {
          programId,
          subjectId,
          yearId,
          subject: { schoolId },
          program: { schoolId },
        },
        include: { programYear: true },
      }),
      this.prisma.class.findFirst({
        where: {
          id: classId,
          programId,
          yearId,
          program: { schoolId },
        },
      }),
    ]);

    if (!teacher) {
      throw new NotFoundException('Teacher not found for this school');
    }

    if (!programSubject) {
      throw new BadRequestException(
        'Relation between program and subject not found for this school',
      );
    }

    if (!classRoom) {
      throw new NotFoundException('Class not found for this program and year');
    }

    const amount = teacherAssignmentHours(
      programSubject.requiredHours,
      programSubject.programYear.numWeeks,
    );

    const existing = await this.prisma.classSubjectAssignment.findUnique({
      where: {
        classId_programId_subjectId_yearId: {
          classId,
          programId,
          subjectId,
          yearId,
        },
      },
      include: assignmentInclude,
    });

    if (existing?.teacherId === teacherId) {
      return existing;
    }

    return this.prisma.$transaction(async (tx) => {
      if (existing) {
        const previousAmount = teacherAssignmentHours(
          programSubject.requiredHours,
          programSubject.programYear.numWeeks,
        );

        await tx.teacher.update({
          where: { id: existing.teacherId },
          data: { assignedHours: { decrement: previousAmount } },
        });
        await syncTeacherTotalHours(tx, existing.teacherId);

        await tx.classSubjectAssignment.delete({
          where: {
            classId_programId_subjectId_yearId: {
              classId,
              programId,
              subjectId,
              yearId,
            },
          },
        });
      }

      await tx.teacher.update({
        where: { id: teacherId },
        data: { assignedHours: { increment: amount } },
      });
      await syncTeacherTotalHours(tx, teacherId);

      return tx.classSubjectAssignment.create({
        data: {
          class: { connect: { id: classId } },
          programSubject: {
            connect: {
              programId_subjectId_yearId: { programId, subjectId, yearId },
            },
          },
          teacher: { connect: { id: teacherId } },
        },
        include: assignmentInclude,
      });
    });
  }

  async deleteAsignment(schoolId: number, data: DeleteAssignmentDto) {
    const { classId, subjectId, teacherId, programId, yearId } = data;

    const assignment = await this.prisma.classSubjectAssignment.findFirst({
      where: {
        classId,
        programId,
        subjectId,
        yearId,
        teacherId,
        class: { program: { schoolId } },
      },
      include: {
        programSubject: {
          include: { programYear: true },
        },
      },
    });

    if (!assignment) {
      throw new NotFoundException('Assignment not found for this class');
    }

    const amount = teacherAssignmentHours(
      assignment.programSubject.requiredHours,
      assignment.programSubject.programYear.numWeeks,
    );

    return this.prisma.$transaction(async (tx) => {
      await tx.classSubjectAssignment.delete({
        where: {
          classId_programId_subjectId_yearId: {
            classId,
            programId,
            subjectId,
            yearId,
          },
        },
      });

      await tx.teacher.update({
        where: { id: teacherId },
        data: {
          assignedHours: {
            decrement: amount,
          },
        },
      });

      await syncTeacherTotalHours(tx, teacherId);
    });
  }
}
