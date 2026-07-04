import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, SubjectTeacher } from 'generated/prisma/client';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';

const assignmentInclude = {
  subject: { omit: { schoolId: true } },
  teacher: { omit: { schoolId: true } },
} as const satisfies Prisma.SubjectTeacherInclude;

export type AssignmentWithRelations = Prisma.SubjectTeacherGetPayload<{
  include: typeof assignmentInclude;
}>;

@Injectable()
export class AssignmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async assignmentsBySchool(
    schoolId: number,
  ): Promise<AssignmentWithRelations[]> {
    return this.prisma.subjectTeacher.findMany({
      where: { subject: { schoolId } },
      include: assignmentInclude,
    });
  }

  async createAssignment(
    schoolId: number,
    data: CreateAssignmentDto,
  ): Promise<SubjectTeacher> {
    const { subjectId, teacherId, programId } = data;

    const [teacher, programSubject] = await Promise.all([
      this.prisma.teacher.findFirst({
        where: { id: teacherId, schoolId },
      }),
      this.prisma.programSubject.findFirst({
        where: {
          programId,
          subjectId,
          subject: { schoolId: schoolId },
          program: { schoolId: schoolId },
        },
      }),
    ]);

    if (!teacher) {
      throw new NotFoundException('Teacher not found for this school');
    }

    if (!programSubject) {
      throw new BadRequestException(
        'Relation between program and subject not found for this school',
      );
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.teacher.update({
        where: { id: teacherId },
        data: { assignedHours: { increment: programSubject.requiredHours } },
      });
      return tx.subjectTeacher.create({
        data: {
          subject: { connect: { id: subjectId } },
          teacher: { connect: { id: teacherId } },
        },
      });
    });
  }
}
