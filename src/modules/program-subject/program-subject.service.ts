import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, ProgramSubject } from 'generated/prisma/client';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateProgramSubjectDto } from './dto/create-program-subject.dto';

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
      class: { include: { label: true } },
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
}
