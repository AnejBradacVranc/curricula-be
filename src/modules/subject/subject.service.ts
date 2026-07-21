import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';

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
      orderBy: [{ category: { name: 'asc' } }, { name: 'asc' }],
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

  async updateSubject(
    schoolId: number,
    data: UpdateSubjectDto,
  ): Promise<SubjectWithCategory> {
    const { id, categoryId, ...rest } = data;

    try {
      return await this.prisma.subject.update({
        where: { id, schoolId },
        data: {
          ...rest,
          category: { connect: { id: categoryId } },
        },
        include: subjectInclude,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Subject not found');
      }

      throw error;
    }
  }
}
