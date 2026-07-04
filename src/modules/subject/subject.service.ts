import { Injectable } from '@nestjs/common';
import { Prisma, Subject } from 'generated/prisma/client';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class SubjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async subjects(): Promise<Subject[] | null> {
    return this.prisma.subject.findMany();
  }

  async createSubject(data: Prisma.SubjectCreateInput): Promise<Subject> {
    return this.prisma.subject.create({ data });
  }
}
