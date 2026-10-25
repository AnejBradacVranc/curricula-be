import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, ProgramYear } from 'generated/prisma/client';
import { PrismaService } from 'src/core/prisma/prisma.service';
import {
  applyTeacherHourDeltas,
  calcTotalHours,
  teacherAssignmentHoursDelta,
} from '../teacher/teacher-hours.util';
import { CreateProgramYearDto } from './dto/create-program-year.dto';
import { UpdateProgramYearDto } from './dto/update-program-year.dto';
import { DeleteProgramYearDto } from './dto/delete-program-year.dto';

const programYearInclude = {
  year: true,
  classes: {
    orderBy: { label: 'asc' },
  },
} as const satisfies Prisma.ProgramYearInclude;

export type ProgramYearWithRelations = Prisma.ProgramYearGetPayload<{
  include: typeof programYearInclude;
}>;

@Injectable()
export class ProgramYearsService {
  constructor(private readonly prisma: PrismaService) {}

  async createProgramYear(
    schoolId: number,
    data: CreateProgramYearDto,
  ): Promise<ProgramYearWithRelations> {
    const { programId, yearId, numWeeks } = data;

    const [program, year, existingProgramYear] = await Promise.all([
      this.prisma.program.findUnique({ where: { id: programId } }),
      this.prisma.year.findUnique({ where: { id: yearId } }),
      this.prisma.programYear.findUnique({
        where: { programId_yearId: { programId, yearId } },
      }),
    ]);

    if (!program || program.schoolId !== schoolId) {
      throw new NotFoundException('Program not found');
    }

    if (!year) {
      throw new NotFoundException('Year not found');
    }

    if (existingProgramYear) {
      throw new ConflictException('Program year already exists');
    }

    return this.prisma.programYear.create({
      data: {
        programId,
        yearId,
        numWeeks,
      },
      include: programYearInclude,
    });
  }

  async deleteProgramYear(
    schoolId: number,
    data: DeleteProgramYearDto,
  ): Promise<ProgramYear> {
    const { yearId, programId } = data;

    const programYear = await this.prisma.programYear.findUnique({
      where: { programId_yearId: { programId, yearId } },
      include: { program: true },
    });

    if (!programYear || programYear.program.schoolId !== schoolId) {
      throw new NotFoundException('Program year not found');
    }

    return this.prisma.$transaction(async (tx) => {
      const assignments = await tx.classSubjectAssignment.findMany({
        where: { programId, yearId },
        include: { programSubject: true },
      });

      const deltaByTeacher = new Map<number, Prisma.Decimal>();

      for (const assignment of assignments) {
        const hours = calcTotalHours(
          assignment.programSubject.requiredHours,
          programYear.numWeeks,
        );

        const prev =
          deltaByTeacher.get(assignment.teacherId) ?? new Prisma.Decimal(0);
        deltaByTeacher.set(assignment.teacherId, prev.sub(hours));
      }

      await applyTeacherHourDeltas(tx, schoolId, deltaByTeacher);

      await tx.classSubjectAssignment.deleteMany({
        where: { programId, yearId },
      });
      await tx.programSubject.deleteMany({
        where: { programId, yearId },
      });
      await tx.class.deleteMany({
        where: { programId, yearId },
      });

      return tx.programYear.delete({
        where: { programId_yearId: { programId, yearId } },
      });
    });
  }

  async updateProgramYear(
    schoolId: number,
    data: UpdateProgramYearDto,
  ): Promise<ProgramYearWithRelations> {
    const { programId, yearId, numWeeks } = data;

    const programYear = await this.prisma.programYear.findUnique({
      where: { programId_yearId: { programId, yearId } },
      include: { program: true },
    });

    if (!programYear) {
      throw new NotFoundException('Program year not found');
    }

    if (programYear.program.schoolId !== schoolId) {
      throw new NotFoundException('Program does not belong to this school');
    }

    const oldNumWeeks = programYear.numWeeks;

    if (oldNumWeeks === numWeeks) {
      return this.prisma.programYear.findUniqueOrThrow({
        where: { programId_yearId: { programId, yearId } },
        include: programYearInclude,
      });
    }

    return this.prisma.$transaction(async (tx) => {
      const assignments = await tx.classSubjectAssignment.findMany({
        where: { programId, yearId },
        include: { programSubject: true },
      });

      const deltaByTeacher = new Map<number, Prisma.Decimal>();

      for (const assignment of assignments) {
        const delta = teacherAssignmentHoursDelta(
          assignment.programSubject.requiredHours,
          assignment.programSubject.requiredHours,
          oldNumWeeks,
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

      return tx.programYear.update({
        where: { programId_yearId: { programId, yearId } },
        data: { numWeeks },
        include: programYearInclude,
      });
    });
  }
}
