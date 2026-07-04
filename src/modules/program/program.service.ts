import { Injectable } from '@nestjs/common';
import { Program } from 'generated/prisma/client';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class ProgramsService {
  constructor(private readonly prisma: PrismaService) {}

  async getPrograms(): Promise<Program[] | null> {
    return this.prisma.program.findMany();
  }
}
