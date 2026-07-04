import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, ProgramSubject } from 'generated/prisma/client';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateProgramSubjectDto } from './dto/create-program-subject.dto';

const programSubjectInclude = {
  subject: { omit: { schoolId: true } },
  program: { omit: { schoolId: true } },
} as const satisfies Prisma.ProgramSubjectInclude;

export type ProgramSubjectWithRelations = Prisma.ProgramSubjectGetPayload<{
  include: typeof programSubjectInclude;
}>;

@Injectable()
export class ProgramSubjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async programSubjects(): Promise<ProgramSubjectWithRelations[]> {
    return this.prisma.programSubject.findMany({
      include: programSubjectInclude,
    });
  }

  async createProgramSubject(
    data: CreateProgramSubjectDto,
  ): Promise<ProgramSubject> {
    const { programId, subjectId, requiredHours } = data;

    const [program, subject] = await Promise.all([
      this.prisma.program.findUnique({ where: { id: programId } }),
      this.prisma.subject.findUnique({ where: { id: subjectId } }),
    ]);

    if (!program || !subject) {
      throw new NotFoundException('Program or subject not found');
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
      },
    });
  }
}
