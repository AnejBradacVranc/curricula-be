import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateSubjectDto } from './dto/create-subject.dto';

const subjectInclude = {
  category: true,
} as const satisfies Prisma.SubjectInclude;

export type SubjectWithCategory = Prisma.SubjectGetPayload<{
  include: typeof subjectInclude;
}>;

@Injectable()
export class SubjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async subjectsBySchool(schoolId: number): Promise<SubjectWithCategory[]> {
    return this.prisma.subject.findMany({
      where: { schoolId },
      include: subjectInclude,
    });
  }

  async createSubject(
    schoolId: number,
    data: CreateSubjectDto,
  ): Promise<SubjectWithCategory> {
    const { categoryId, ...rest } = data;

    return this.prisma.subject.create({
      data: {
        ...rest,
        school: { connect: { id: schoolId } },
        category: { connect: { id: categoryId } },
      },
      include: subjectInclude,
    });
  }
}
