import { Injectable } from '@nestjs/common';
import { Subject } from 'generated/prisma/client';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class SubjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async getSubjects(): Promise<Subject[] | null> {
    return this.prisma.subject.findMany();
  }
}
