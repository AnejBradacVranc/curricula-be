import { Injectable } from '@nestjs/common';
import { Prisma, School } from 'generated/prisma/client';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class SchoolsService {
  constructor(private readonly prisma: PrismaService) {}

  async schools(): Promise<School[] | null> {
    return this.prisma.school.findMany();
  }

  async createSchool(data: Prisma.SchoolCreateInput): Promise<School> {
    return this.prisma.school.create({ data });
  }
}
