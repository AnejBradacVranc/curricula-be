import { Injectable } from '@nestjs/common';
import { Teacher } from 'generated/prisma/client';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class TeachersService {
  constructor(private readonly prisma: PrismaService) {}

  async getTeachers(): Promise<Teacher[] | null> {
    return this.prisma.teacher.findMany();
  }
}
