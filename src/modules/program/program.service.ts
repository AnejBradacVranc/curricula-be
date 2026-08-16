import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Program } from 'generated/prisma/client';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateProgramDto } from './dto/create-program.dto';
import { ImportProgramDto } from './dto/import-program.dto';
import {
  applyTeacherHourDeltas,
  teacherAssignmentHours,
} from '../teacher/teacher-hours.util';

const programInclude = {
  programYears: {
    omit: { programId: true },
    include: {
      year: true,
      classes: {
        orderBy: { label: 'asc' },
      },
    },
  },
  programSubjects: {
    omit: { programId: true },
    include: {
      subject: { omit: { schoolId: true }, include: { category: true } },
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
    },
  },
} as const satisfies Prisma.ProgramInclude;

const programListSelect = {
  id: true,
  name: true,
  createdAt: true,
  updatedAt: true,
  programYears: {
    omit: { programId: true, yearId: true },
  },
  programSubjects: {
    omit: { programId: true, subjectId: true, yearId: true },
    include: {
      subject: { omit: { schoolId: true, categoryId: true, id: true } },
    },
  },
} as const satisfies Prisma.ProgramSelect;

export type ProgramWithRelations = Prisma.ProgramGetPayload<{
  include: typeof programInclude;
}>;

export type ProgramLean = Prisma.ProgramGetPayload<{
  select: typeof programListSelect;
}>;

@Injectable()
export class ProgramsService {
  constructor(private readonly prisma: PrismaService) {}

  async programById(
    schoolId: number,
    programId: number,
  ): Promise<ProgramWithRelations | null> {
    return this.prisma.program.findUnique({
      where: { schoolId, id: programId },
      include: programInclude,
    });
  }

  async programs(schoolId: number): Promise<ProgramLean[]> {
    return this.prisma.program.findMany({
      where: { schoolId },
      select: programListSelect,
    });
  }

  async deleteProgram(schoolId: number, programId: number): Promise<Program> {
    const program = await this.prisma.program.findUnique({
      where: { schoolId, id: programId },
    });

    if (!program) {
      throw new NotFoundException('Program not found');
    }

    return this.prisma.$transaction(async (tx) => {
      const assignments = await tx.classSubjectAssignment.findMany({
        where: { programId },
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
        where: { programId },
      });
      await tx.programSubject.deleteMany({
        where: { programId },
      });
      await tx.class.deleteMany({
        where: { programId },
      });
      await tx.programYear.deleteMany({
        where: { programId },
      });
      return tx.program.delete({
        where: { schoolId, id: programId },
      });
    });
  }

  async createProgram(
    schoolId: number,
    data: CreateProgramDto,
  ): Promise<Program> {
    return this.prisma.program.create({
      data: {
        ...data,
        school: { connect: { id: schoolId } },
      },
    });
  }

  async importProgram(
    schoolId: number,
    data: ImportProgramDto,
  ): Promise<ProgramWithRelations> {
    const programId = await this.prisma.$transaction(async (tx) => {
      const subjectIdByKey = new Map<string, number>();

      for (const year of data.years) {
        for (const subject of year.subjects) {
          if (subject.subjectId != null) {
            continue;
          }

          const name = subject.name!.trim();
          const key = name.toLowerCase();
          if (subjectIdByKey.has(key)) {
            continue;
          }

          const created = await tx.subject.create({
            data: {
              name,
              abbrevation: subject.abbrevation!.trim(),
              school: { connect: { id: schoolId } },
              category: { connect: { id: subject.categoryId! } },
            },
          });
          subjectIdByKey.set(key, created.id);
        }
      }

      const program = await tx.program.create({
        data: {
          name: data.name.trim(),
          school: { connect: { id: schoolId } },
        },
      });

      for (const year of data.years) {
        await tx.programYear.create({
          data: {
            programId: program.id,
            yearId: year.yearId,
            numWeeks: year.numWeeks,
          },
        });

        for (const subject of year.subjects) {
          const subjectId =
            subject.subjectId ??
            subjectIdByKey.get(subject.name!.trim().toLowerCase());

          if (subjectId == null) {
            throw new BadRequestException(
              `Could not resolve subject "${subject.name ?? subject.subjectId}"`,
            );
          }

          await tx.programSubject.create({
            data: {
              programId: program.id,
              subjectId,
              yearId: year.yearId,
              requiredHours: subject.requiredHours,
            },
          });
        }
      }

      return program.id;
    });

    return this.prisma.program.findUniqueOrThrow({
      where: { id: programId, schoolId },
      include: programInclude,
    });
  }
}
