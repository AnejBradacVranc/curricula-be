import { Injectable } from '@nestjs/common';
import { Subject } from 'generated/prisma/client';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateSubjectDto } from './dto/create-subject.dto';

@Injectable()
export class SubjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async subjects(): Promise<Subject[]> {
    return this.prisma.subject.findMany();
  }

  async createSubject(data: CreateSubjectDto): Promise<Subject> {
    const { schoolId, ...rest } = data;
    return this.prisma.subject.create({
      data: {
        ...rest,
        school: { connect: { id: schoolId } },
      },
    });
  }
}
