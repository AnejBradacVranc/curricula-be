import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { syncTeacherTotalHours } from '../teacher/teacher-hours.util';
import { AdditionalActivityDto } from './dto/additional-activity.dto';
import { CreateAdditionalActivityDto } from './dto/create-additional-activity.dto';
import { DeleteAdditionalActivityDto } from './dto/delete-additional-activity.dto';
import { UpdateAdditionalActivityDto } from './dto/update-additional-activity.dto';

const additionalActivitySelect = {
  id: true,
  name: true,
} as const satisfies Prisma.AdditionalActivitiesSelect;

@Injectable()
export class AdditionalActivityService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<AdditionalActivityDto[]> {
    return this.prisma.additionalActivities.findMany({
      orderBy: { name: 'asc' },
      select: additionalActivitySelect,
    });
  }

  async findOne(id: number): Promise<AdditionalActivityDto> {
    const activity = await this.prisma.additionalActivities.findUnique({
      where: { id },
      select: additionalActivitySelect,
    });

    if (!activity) {
      throw new NotFoundException('Additional activity not found');
    }

    return activity;
  }

  async create(
    data: CreateAdditionalActivityDto,
  ): Promise<AdditionalActivityDto> {
    const name = data.name.trim();

    const existing = await this.prisma.additionalActivities.findFirst({
      where: { name: { equals: name, mode: 'insensitive' } },
    });

    if (existing) {
      throw new ConflictException('Additional activity already exists');
    }

    return this.prisma.additionalActivities.create({
      data: { name },
      select: additionalActivitySelect,
    });
  }

  async update(
    data: UpdateAdditionalActivityDto,
  ): Promise<AdditionalActivityDto> {
    const name = data.name.trim();

    const activity = await this.prisma.additionalActivities.findUnique({
      where: { id: data.id },
    });

    if (!activity) {
      throw new NotFoundException('Additional activity not found');
    }

    const duplicate = await this.prisma.additionalActivities.findFirst({
      where: {
        id: { not: data.id },
        name: { equals: name, mode: 'insensitive' },
      },
    });

    if (duplicate) {
      throw new ConflictException('Additional activity already exists');
    }

    return this.prisma.additionalActivities.update({
      where: { id: data.id },
      data: { name },
      select: additionalActivitySelect,
    });
  }

  async delete(data: DeleteAdditionalActivityDto): Promise<AdditionalActivityDto> {
    const activity = await this.prisma.additionalActivities.findUnique({
      where: { id: data.id },
      select: additionalActivitySelect,
    });

    if (!activity) {
      throw new NotFoundException('Additional activity not found');
    }

    return this.prisma.$transaction(async (tx) => {
      const assignments = await tx.additionalTeacherAssignment.findMany({
        where: { additionalActivityId: data.id },
      });

      for (const assignment of assignments) {
        await tx.teacher.update({
          where: { id: assignment.teacherId },
          data: {
            additionalActivityHours: { decrement: assignment.hoursAmount },
          },
        });
        await syncTeacherTotalHours(tx, assignment.teacherId);
      }

      await tx.additionalTeacherAssignment.deleteMany({
        where: { additionalActivityId: data.id },
      });

      return tx.additionalActivities.delete({
        where: { id: data.id },
        select: additionalActivitySelect,
      });
    });
  }
}
