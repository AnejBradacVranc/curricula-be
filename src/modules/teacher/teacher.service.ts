import { Injectable } from '@nestjs/common';
import { Teacher } from 'generated/prisma/client';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';

@Injectable()
export class TeachersService {
  constructor(private readonly prisma: PrismaService) {}

  async teachers(): Promise<Teacher[] | null> {
    return this.prisma.teacher.findMany();
  }

  async createTeacher(data: CreateTeacherDto): Promise<Teacher> {
    const { schoolId, ...rest } = data;
    return this.prisma.teacher.create({
      data: {
        ...rest,
        program: { connect: { id: schoolId } },
      },
    });
  }
}
