import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, ProgramSubject } from 'generated/prisma/client';
import { PrismaService } from 'src/core/prisma/prisma.service';
import {
  applyTeacherHourDeltas,
  teacherAssignmentHours,
  teacherAssignmentHoursDelta,
} from '../teacher/teacher-hours.util';
import { CreateProgramSubjectDto } from './dto/create-program-subject.dto';
import { DeleteProgramSubjectDto } from './dto/delete-program-subject.dto';
import { UpdateProgramSubjectDto } from './dto/update-program-subject.dto';

const programSubjectInclude = {
  subject: { omit: { schoolId: true }, include: { category: true } },
  program: { omit: { schoolId: true } },
  programYear: {
    include: {
      year: true,
    },
  },
  assignments: {
    include: {
      class: true,
      teacher: { omit: { schoolId: true } },
    },
  },
} as const satisfies Prisma.ProgramSubjectInclude;

export type ProgramSubjectWithRelations = Prisma.ProgramSubjectGetPayload<{
  include: typeof programSubjectInclude;
}>;

@Injectable()
export class ProgramSubjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async programSubjectsBySchool(
    schoolId: number,
  ): Promise<ProgramSubjectWithRelations[]> {
    return this.prisma.programSubject.findMany({
      where: { program: { schoolId } },
      include: programSubjectInclude,
    });
  }

  async createProgramSubject(
    schoolId: number,
    data: CreateProgramSubjectDto,
  ): Promise<ProgramSubject> {
    const { programId, subjectId, yearId, requiredHours } = data;

    const [program, subject, programYear] = await Promise.all([
      this.prisma.program.findUnique({ where: { id: programId } }),
      this.prisma.subject.findUnique({ where: { id: subjectId } }),
      this.prisma.programYear.findUnique({
        where: { programId_yearId: { programId, yearId } },
      }),
    ]);

    if (!program || !subject) {
      throw new NotFoundException('Program or subject not found');
    }

    if (!programYear) {
      throw new NotFoundException('Program year not found');
    }

    if (program.schoolId !== schoolId || subject.schoolId !== schoolId) {
      throw new BadRequestException(
        'Program and subject must belong to this school',
      );
    }

    if (program.schoolId !== subject.schoolId) {
      throw new BadRequestException(
        'Program and subject must belong to the same school',
      );
    }

    return this.prisma.programSubject.create({
      data: {
        requiredHours,
        program: { connect: { id: programId } },
        subject: { connect: { id: subjectId } },
        programYear: { connect: { programId_yearId: { programId, yearId } } },
      },
    });
  }

  async updateProgramSubject(
    schoolId: number,
    data: UpdateProgramSubjectDto,
  ): Promise<ProgramSubjectWithRelations> {
    const { programId, subjectId, yearId, requiredHours } = data;
    const newRequiredHours = new Prisma.Decimal(requiredHours);

    const programSubject = await this.prisma.programSubject.findFirst({
      where: {
        programId,
        subjectId,
        yearId,
        program: { schoolId },
      },
      include: { programYear: true },
    });

    if (!programSubject) {
      throw new NotFoundException('Program subject not found');
    }

    const oldRequiredHours = programSubject.requiredHours;

    if (oldRequiredHours.equals(newRequiredHours)) {
      return this.prisma.programSubject.findUniqueOrThrow({
        where: {
          programId_subjectId_yearId: { programId, subjectId, yearId },
        },
        include: programSubjectInclude,
      });
    }

    return this.prisma.$transaction(async (tx) => {
      const assignments = await tx.classSubjectAssignment.findMany({
        where: { programId, subjectId, yearId },
      });

      const deltaByTeacher = new Map<number, Prisma.Decimal>();
      const numWeeks = programSubject.programYear.numWeeks;

      for (const assignment of assignments) {
        const delta = teacherAssignmentHoursDelta(
          oldRequiredHours,
          newRequiredHours,
          numWeeks,
          numWeeks,
        );

        if (delta.isZero()) {
          continue;
        }

        const current =
          deltaByTeacher.get(assignment.teacherId) ?? new Prisma.Decimal(0);
        deltaByTeacher.set(assignment.teacherId, current.add(delta));
      }

      await applyTeacherHourDeltas(tx, schoolId, deltaByTeacher);

      return tx.programSubject.update({
        where: {
          programId_subjectId_yearId: { programId, subjectId, yearId },
        },
        data: { requiredHours: newRequiredHours },
        include: programSubjectInclude,
      });
    });
  }

  async deleteProgramSubject(
    schoolId: number,
    data: DeleteProgramSubjectDto,
  ): Promise<void> {
    const { programId, subjectId, yearId } = data;

    const programSubject = await this.prisma.programSubject.findFirst({
      where: {
        programId,
        subjectId,
        yearId,
        program: { schoolId },
      },
      include: { programYear: true },
    });

    if (!programSubject) {
      throw new NotFoundException('Program subject not found');
    }

    await this.prisma.$transaction(async (tx) => {
      const assignments = await tx.classSubjectAssignment.findMany({
        where: { programId, subjectId, yearId },
      });

      const deltaByTeacher = new Map<number, Prisma.Decimal>();
      const hours = teacherAssignmentHours(
        programSubject.requiredHours,
        programSubject.programYear.numWeeks,
      );

      for (const assignment of assignments) {
        const prev =
          deltaByTeacher.get(assignment.teacherId) ?? new Prisma.Decimal(0);
        deltaByTeacher.set(assignment.teacherId, prev.sub(hours));
      }

      await applyTeacherHourDeltas(tx, schoolId, deltaByTeacher);

      await tx.classSubjectAssignment.deleteMany({
        where: { programId, subjectId, yearId },
      });

      await tx.programSubject.delete({
        where: {
          programId_subjectId_yearId: { programId, subjectId, yearId },
        },
      });
    });
  }
}
