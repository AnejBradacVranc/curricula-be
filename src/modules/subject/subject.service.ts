import { Injectable } from '@nestjs/common';
import { Subject } from 'generated/prisma/client';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateSubjectDto } from './dto/create-subject.dto';

@Injectable()
export class SubjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async subjectsBySchool(schoolId: number): Promise<Subject[]> {
    return this.prisma.subject.findMany({
      where: { schoolId },
    });
  }

  async createSubject(
    schoolId: number,
    data: CreateSubjectDto,
  ): Promise<Subject> {
    return this.prisma.subject.create({
      data: {
        ...data,
        school: { connect: { id: schoolId } },
      },
    });
  }
}
