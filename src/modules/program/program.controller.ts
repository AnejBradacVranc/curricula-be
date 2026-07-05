import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { Program } from 'generated/prisma/client';
import { CreateProgramDto } from './dto/create-program.dto';
import { ProgramsService, ProgramWithRelations } from './program.service';
import { AuthenticatedUser } from '../auth/strategies/jwt.strategy';

@Controller()
export class ProgramsController {
  constructor(private readonly programsService: ProgramsService) {}

  @Get()
  async getPrograms(
    @Request() req: { user: AuthenticatedUser },
  ): Promise<ProgramWithRelations[]> {
    return this.programsService.programsBySchool(req.user.schoolId);
  }

  @Post()
  async createProgram(
    @Request() req: { user: AuthenticatedUser },
    @Body() createProgramDto: CreateProgramDto,
  ): Promise<Program> {
    return this.programsService.createProgram(
      req.user.schoolId,
      createProgramDto,
    );
  }
}
