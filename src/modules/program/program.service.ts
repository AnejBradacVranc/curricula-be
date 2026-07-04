import { Injectable } from '@nestjs/common';
import { Program } from 'generated/prisma/client';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateProgramDto } from './dto/create-program.dto';

@Injectable()
export class ProgramsService {
  constructor(private readonly prisma: PrismaService) {}

  async programs(): Promise<Program[] | null> {
    return this.prisma.program.findMany();
  }

  async createProgram(data: CreateProgramDto): Promise<Program> {
    const { schoolId, availableHours } = data;
    return this.prisma.program.create({
      data: {
        availableHours,
        school: { connect: { id: schoolId } },
      },
    });
  }
}
