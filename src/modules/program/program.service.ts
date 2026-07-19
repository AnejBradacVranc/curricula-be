import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Program } from 'generated/prisma/client';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateProgramDto } from './dto/create-program.dto';

const programInclude = {
  programYears: {
    omit: { programId: true },
    orderBy: { yearId: 'asc' },
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

export type ProgramWithRelations = Prisma.ProgramGetPayload<{
  include: typeof programInclude;
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

  async programsBySchool(schoolId: number): Promise<ProgramWithRelations[]> {
    return this.prisma.program.findMany({
      where: { schoolId },
      include: programInclude,
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
}
