import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { AdditionalActivityDto } from './dto/additional-activity.dto';

@Injectable()
export class AdditionalActivityService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<AdditionalActivityDto[]> {
    return this.prisma.additionalActivities.findMany({
      orderBy: { name: 'asc' },
      select: { id: true, name: true },
    });
  }
}
