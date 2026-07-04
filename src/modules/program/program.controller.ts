import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { Program } from 'generated/prisma/client';
import { CreateProgramDto } from './dto/create-program.dto';
import { ProgramsService, ProgramWithRelations } from './program.service';

@Controller()
export class ProgramsController {
  constructor(private readonly programsService: ProgramsService) {}

  @Get()
  async getPrograms(
    @Param('schoolId', ParseIntPipe) schoolId: number,
  ): Promise<ProgramWithRelations[]> {
    return this.programsService.programsBySchool(schoolId);
  }

  @Post()
  async createProgram(
    @Param('schoolId', ParseIntPipe) schoolId: number,
    @Body() createProgramDto: CreateProgramDto,
  ): Promise<Program> {
    return this.programsService.createProgram(schoolId, createProgramDto);
  }
}
