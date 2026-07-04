import { Injectable } from '@nestjs/common';
import { Prisma, SubjectTeacher } from 'generated/prisma/client';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class AssignmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async assignments(): Promise<SubjectTeacher[] | null> {
    return this.prisma.subjectTeacher.findMany();
  }

  async createAssignment(
    data: Prisma.SubjectTeacherCreateInput,
  ): Promise<SubjectTeacher> {
    return this.prisma.subjectTeacher.create({ data });
  }
}
