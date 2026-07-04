import { Injectable } from '@nestjs/common';
import { Prisma, Teacher } from 'generated/prisma/client';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class TeachersService {
  constructor(private readonly prisma: PrismaService) {}

  async teachers(): Promise<Teacher[] | null> {
    return this.prisma.teacher.findMany();
  }

  async createTeacher(data: Prisma.TeacherCreateInput): Promise<Teacher> {
    return this.prisma.teacher.create({ data });
  }
}
