import { Injectable } from '@nestjs/common';
import { School } from 'generated/prisma/client';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class SchoolsService {
  constructor(private readonly prisma: PrismaService) {}

  async getSchools(): Promise<School[] | null> {
    return this.prisma.school.findMany();
  }
}
