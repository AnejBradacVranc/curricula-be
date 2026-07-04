import { Injectable } from '@nestjs/common';
import { Prisma, School } from 'generated/prisma/client';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateSchoolDto } from './dto/create-school.dto';

const schoolInclude = {
  users: false,
  programs: { omit: { schoolId: true } },
  subjects: { omit: { schoolId: true } },
  teachers: { omit: { schoolId: true } },
} as const satisfies Prisma.SchoolInclude;

export type SchoolWithRelations = Prisma.SchoolGetPayload<{
  include: typeof schoolInclude;
}>;

@Injectable()
export class SchoolsService {
  constructor(private readonly prisma: PrismaService) {}

  async schools(): Promise<SchoolWithRelations[]> {
    return this.prisma.school.findMany({
      include: schoolInclude,
    });
  }

  async createSchool(data: CreateSchoolDto): Promise<School> {
    return this.prisma.school.create({ data });
  }
}
