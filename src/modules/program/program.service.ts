import { Injectable } from '@nestjs/common';
import { Prisma, Program } from 'generated/prisma/client';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateProgramDto } from './dto/create-program.dto';

const programInclude = {
  programYears: {
    omit: { programId: true },
    include: {
      year: true,
      classes: {
        include: {
          label: true,
        },
      },
    },
  },
  programSubjects: {
    omit: { programId: true },
    include: {
      subject: { omit: { schoolId: true } },
      programYear: {
        include: {
          year: true,
        },
      },
      assignments: {
        include: {
          class: { include: { label: true } },
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

  async programsBySchool(schoolId: number): Promise<ProgramWithRelations[]> {
    return this.prisma.program.findMany({
      where: { schoolId },
      include: programInclude,
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
