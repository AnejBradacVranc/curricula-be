import { Injectable } from '@nestjs/common';
import { SubjectTeacher } from 'generated/prisma/client';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class AssignmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAssignments(): Promise<SubjectTeacher[] | null> {
    return this.prisma.subjectTeacher.findMany();
  }
}
