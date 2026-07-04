import { Controller, Get } from '@nestjs/common';
import { Program } from 'generated/prisma/client';
import { ProgramsService } from './program.service';

@Controller('programs')
export class ProgramsController {
  constructor(private readonly programsService: ProgramsService) {}

  @Get()
  async getPrograms(): Promise<Program[] | null> {
    return this.programsService.getPrograms();
  }
}
