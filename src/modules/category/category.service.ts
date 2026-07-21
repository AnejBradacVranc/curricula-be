import { Injectable } from '@nestjs/common';
import { Category } from 'generated/prisma/client';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Category[]> {
    return this.prisma.category.findMany({ orderBy: { name: 'asc' } });
  }
}
