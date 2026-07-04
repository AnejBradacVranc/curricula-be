import { Injectable } from '@nestjs/common';
import { School } from 'generated/prisma/client';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateSchoolDto } from './dto/create-school.dto';

@Injectable()
export class SchoolsService {
  constructor(private readonly prisma: PrismaService) {}

  async schools(): Promise<School[] | null> {
    return this.prisma.school.findMany();
  }

  async createSchool(data: CreateSchoolDto): Promise<School> {
    return this.prisma.school.create({ data });
  }
}
