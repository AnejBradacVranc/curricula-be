import { Controller, Get } from '@nestjs/common';
import { Teacher } from 'generated/prisma/client';
import { TeachersService } from './teacher.service';

@Controller('teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Get()
  async getTeachers(): Promise<Teacher[] | null> {
    return this.teachersService.getTeachers();
  }
}
