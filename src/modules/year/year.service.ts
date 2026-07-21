import { Injectable } from '@nestjs/common';
import { Year } from 'generated/prisma/client';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class YearsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Year[]> {
    return this.prisma.year.findMany({ orderBy: { name: 'asc' } });
  }
}
