import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { syncTeacherTotalHours } from '../teacher/teacher-hours.util';
import { CreateAdditionalActivityAssignmentDto } from './dto/create-additional-activity-assignment.dto';
import { DeleteAdditionalActivityAssignmentDto } from './dto/delete-additional-activity-assignment.dto';

const additionalAssignmentInclude = {
  additionalActivity: true,
  teacher: { omit: { schoolId: true } },
} as const satisfies Prisma.AdditionalTeacherAssignmentInclude;

export type AdditionalActivityAssignmentWithRelations =
  Prisma.AdditionalTeacherAssignmentGetPayload<{
    include: typeof additionalAssignmentInclude;
  }>;

@Injectable()
export class AdditionalActivityAssignmentService {
  constructor(private readonly prisma: PrismaService) {}

  async upsertAssignment(
    schoolId: number,
    data: CreateAdditionalActivityAssignmentDto,
  ): Promise<AdditionalActivityAssignmentWithRelations> {
    const { teacherId, additionalActivityId, hoursAmount } = data;
    const hours = new Prisma.Decimal(hoursAmount);

    const [teacher, activity] = await Promise.all([
      this.prisma.teacher.findFirst({
        where: { id: teacherId, schoolId },
      }),
      this.prisma.additionalActivities.findUnique({
        where: { id: additionalActivityId },
      }),
    ]);

    if (!teacher) {
      throw new NotFoundException('Teacher not found for this school');
    }

    if (!activity) {
      throw new NotFoundException('Additional activity not found');
    }

    const existing = await this.prisma.additionalTeacherAssignment.findUnique({
      where: {
        teacherId_additionalActivityId: { teacherId, additionalActivityId },
      },
    });

    return this.prisma.$transaction(async (tx) => {
      if (existing) {
        const delta = hours.minus(existing.hoursAmount);

        if (!delta.isZero()) {
          await tx.teacher.update({
            where: { id: teacherId },
            data: { additionalActivityHours: { increment: delta } },
          });
        }

        const assignment = await tx.additionalTeacherAssignment.update({
          where: {
            teacherId_additionalActivityId: { teacherId, additionalActivityId },
          },
          data: { hoursAmount: hours },
          include: additionalAssignmentInclude,
        });

        await syncTeacherTotalHours(tx, teacherId);
        return assignment;
      }

      await tx.teacher.update({
        where: { id: teacherId },
        data: { additionalActivityHours: { increment: hours } },
      });

      const assignment = await tx.additionalTeacherAssignment.create({
        data: {
          hoursAmount: hours,
          teacher: { connect: { id: teacherId } },
          additionalActivity: { connect: { id: additionalActivityId } },
        },
        include: additionalAssignmentInclude,
      });

      await syncTeacherTotalHours(tx, teacherId);
      return assignment;
    });
  }

  async deleteAssignment(
    schoolId: number,
    data: DeleteAdditionalActivityAssignmentDto,
  ): Promise<void> {
    const { teacherId, additionalActivityId } = data;

    const assignment = await this.prisma.additionalTeacherAssignment.findFirst({
      where: {
        teacherId,
        additionalActivityId,
        teacher: { schoolId },
      },
    });

    if (!assignment) {
      throw new NotFoundException('Additional activity assignment not found');
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.additionalTeacherAssignment.delete({
        where: {
          teacherId_additionalActivityId: { teacherId, additionalActivityId },
        },
      });

      await tx.teacher.update({
        where: { id: teacherId },
        data: {
          additionalActivityHours: { decrement: assignment.hoursAmount },
        },
      });

      await syncTeacherTotalHours(tx, teacherId);
    });
  }
}
