import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { DeleteAssignmentDto } from './dto/delete-assignment.dto';

const programSubjectInclude = {
  subject: { omit: { schoolId: true } },
  programYear: {
    include: {
      year: true,
    },
  },
  teacher: { omit: { schoolId: true } },
} as const satisfies Prisma.ProgramSubjectInclude;

export type AssignedProgramSubject = Prisma.ProgramSubjectGetPayload<{
  include: typeof programSubjectInclude;
}>;

@Injectable()
export class AssignmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async createAssignment(
    schoolId: number,
    data: CreateAssignmentDto,
  ): Promise<AssignedProgramSubject> {
    const { subjectId, teacherId, programId, yearId } = data;

    const [teacher, programSubject] = await Promise.all([
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
    ]);

    if (!teacher) {
      throw new NotFoundException('Teacher not found for this school');
    }

    if (!programSubject) {
      throw new BadRequestException(
        'Relation between program and subject not found for this school',
      );
    }

    if (programSubject.teacherId === teacherId) {
      return this.prisma.programSubject.findUniqueOrThrow({
        where: {
          programId_subjectId_yearId: { programId, subjectId, yearId },
        },
        include: programSubjectInclude,
      });
    }

    return this.prisma.$transaction(async (tx) => {
      if (programSubject.teacherId) {
        await tx.teacher.update({
          where: { id: programSubject.teacherId },
          data: { assignedHours: { decrement: programSubject.requiredHours } },
        });
      }

      await tx.teacher.update({
        where: { id: teacherId },
        data: { assignedHours: { increment: programSubject.requiredHours } },
      });

      return tx.programSubject.update({
        where: {
          programId_subjectId_yearId: { programId, subjectId, yearId },
        },
        data: {
          teacher: { connect: { id: teacherId } },
        },
        include: programSubjectInclude,
      });
    });
  }

  async deleteAsignment(schoolId: number, data: DeleteAssignmentDto) {
    const { subjectId, teacherId, programId, yearId } = data;

    const programSubject = await this.prisma.programSubject.findFirst({
      where: {
        programId,
        subjectId,
        yearId,
        subject: { schoolId },
        program: { schoolId },
      },
    });

    if (!programSubject) {
      throw new BadRequestException(
        'Relation between program and subject not found for this school',
      );
    }

    if (programSubject.teacherId !== teacherId) {
      throw new NotFoundException('Assignment not found for this program');
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.programSubject.update({
        where: {
          programId_subjectId_yearId: { programId, subjectId, yearId },
        },
        data: {
          teacher: { disconnect: true },
        },
      });

      await tx.teacher.update({
        where: { id: teacherId },
        data: { assignedHours: { decrement: programSubject.requiredHours } },
      });
    });
  }
}
