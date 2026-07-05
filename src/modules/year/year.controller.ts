import { Controller, Get } from '@nestjs/common';
import { Year } from 'generated/prisma/client';
import { YearsService } from './year.service';

@Controller()
export class YearsController {
  constructor(private readonly yearsService: YearsService) {}

  @Get()
  async getYears(): Promise<Year[]> {
    return this.yearsService.findAll();
  }
}
