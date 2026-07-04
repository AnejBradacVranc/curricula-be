import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SubjectTeacher } from 'generated/prisma/client';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';

@Injectable()
export class AssignmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async assignments(): Promise<SubjectTeacher[]> {
    return this.prisma.subjectTeacher.findMany();
  }

  async createAssignment(data: CreateAssignmentDto): Promise<SubjectTeacher> {
    const { subjectId, teacherId, ...rest } = data;

    const [subject, teacher] = await Promise.all([
      this.prisma.subject.findUnique({ where: { id: subjectId } }),
      this.prisma.teacher.findUnique({ where: { id: teacherId } }),
    ]);

    if (!subject || !teacher) {
      throw new NotFoundException('Subject or teacher not found');
    }

    if (subject.schoolId !== teacher.schoolId) {
      throw new BadRequestException(
        'Subject and teacher must belong to the same school',
      );
    }

    return this.prisma.subjectTeacher.create({
      data: {
        ...rest,
        subject: { connect: { id: subjectId } },
        teacher: { connect: { id: teacherId } },
      },
    });
  }
}
