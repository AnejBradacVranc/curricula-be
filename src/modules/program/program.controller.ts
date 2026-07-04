import { Body, Controller, Get, Post } from '@nestjs/common';
import { Program } from 'generated/prisma/client';
import { CreateProgramDto } from './dto/create-program.dto';
import { ProgramsService } from './program.service';

@Controller('programs')
export class ProgramsController {
  constructor(private readonly programsService: ProgramsService) {}

  @Get()
  async getPrograms(): Promise<Program[] | null> {
    return this.programsService.programs();
  }

  @Post()
  async createProgram(
    @Body() createProgramDto: CreateProgramDto,
  ): Promise<Program> {
    return this.programsService.createProgram(createProgramDto);
  }
}
