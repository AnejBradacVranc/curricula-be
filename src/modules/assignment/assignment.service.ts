import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { DeleteAssignmentDto } from './dto/delete-assignment.dto';

const assignmentInclude = {
  class: {
    include: {
      label: true,
      programYear: {
        include: {
          year: true,
        },
      },
    },
  },
  programSubject: {
    include: {
      subject: { omit: { schoolId: true } },
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
        await tx.teacher.update({
          where: { id: existing.teacherId },
          data: { assignedHours: { decrement: programSubject.requiredHours } },
        });
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
        data: { assignedHours: { increment: programSubject.requiredHours } },
      });

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
        programSubject: true,
      },
    });

    if (!assignment) {
      throw new NotFoundException('Assignment not found for this class');
    }

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
            decrement: assignment.programSubject.requiredHours,
          },
        },
      });
    });
  }
}
