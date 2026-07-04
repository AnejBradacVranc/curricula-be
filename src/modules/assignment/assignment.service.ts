import { Injectable } from '@nestjs/common';
import { SubjectTeacher } from 'generated/prisma/client';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';

@Injectable()
export class AssignmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async assignments(): Promise<SubjectTeacher[] | null> {
    return this.prisma.subjectTeacher.findMany();
  }

  async createAssignment(data: CreateAssignmentDto): Promise<SubjectTeacher> {
    const { subjectId, teacherId, assignedHours } = data;
    return this.prisma.subjectTeacher.create({
      data: {
        assignedHours,
        subject: { connect: { id: subjectId } },
        teacher: { connect: { id: teacherId } },
      },
    });
  }
}
