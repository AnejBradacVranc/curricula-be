import { Injectable } from '@nestjs/common';
import { Prisma, Program } from 'generated/prisma/client';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class ProgramsService {
  constructor(private readonly prisma: PrismaService) {}

  async programs(): Promise<Program[] | null> {
    return this.prisma.program.findMany();
  }

  async createProgram(data: Prisma.ProgramCreateInput): Promise<Program> {
    return this.prisma.program.create({ data });
  }
}
