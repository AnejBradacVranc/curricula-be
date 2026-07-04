import { Injectable } from '@nestjs/common';
import { Prisma, Program } from 'generated/prisma/client';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateProgramDto } from './dto/create-program.dto';

const programInclude = {
  programSubjects: {
    omit: { programId: true },
    include: {
      subject: true,
    },
  },
} as const satisfies Prisma.ProgramInclude;

export type ProgramWithRelations = Prisma.ProgramGetPayload<{
  include: typeof programInclude;
}>;

@Injectable()
export class ProgramsService {
  constructor(private readonly prisma: PrismaService) {}

  async programs(): Promise<Program[] | null> {
    return this.prisma.program.findMany({
      include: programInclude,
    });
  }

  async createProgram(data: CreateProgramDto): Promise<Program> {
    const { schoolId, ...rest } = data;
    return this.prisma.program.create({
      data: {
        ...rest,
        school: { connect: { id: schoolId } },
      },
    });
  }
}
