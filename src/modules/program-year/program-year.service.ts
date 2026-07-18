import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';
import { PrismaService } from 'src/core/prisma/prisma.service';
import {
  applyTeacherHourDeltas,
  teacherAssignmentHoursDelta,
} from '../teacher/teacher-hours.util';
import { CreateProgramYearDto } from './dto/create-program-year.dto';
import { UpdateProgramYearDto } from './dto/update-program-year.dto';

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

  async updateProgramYear(
    schoolId: number,
    data: UpdateProgramYearDto,
  ): Promise<ProgramYearWithRelations> {
    const { programId, yearId, numWeeks } = data;

    const program = await this.prisma.program.findUnique({
      where: { id: programId },
    });

    if (!program || program.schoolId !== schoolId) {
      throw new NotFoundException('Program not found');
    }

    const programYear = await this.prisma.programYear.findUnique({
      where: { programId_yearId: { programId, yearId } },
    });

    if (!programYear) {
      throw new NotFoundException('Program year not found');
    }

    if (numWeeks < 1) {
      throw new BadRequestException('Number of weeks must be at least 1');
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
