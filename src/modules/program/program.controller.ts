import { Body, Controller, Get, Post } from '@nestjs/common';
import { Prisma, Program } from 'generated/prisma/client';
import { ProgramsService } from './program.service';

@Controller('programs')
export class ProgramsController {
  constructor(private readonly programsService: ProgramsService) {}

  @Get()
  async programs(): Promise<Program[] | null> {
    return this.programsService.programs();
  }

  @Post()
  async createProgram(
    @Body() createProgramDto: Prisma.ProgramCreateInput,
  ): Promise<Program> {
    return this.programsService.createProgram(createProgramDto);
  }
}
