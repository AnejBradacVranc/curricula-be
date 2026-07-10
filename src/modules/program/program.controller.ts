import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { Program } from 'generated/prisma/client';
import { CreateProgramDto } from './dto/create-program.dto';
import { ProgramsService, ProgramWithRelations } from './program.service';
import { AuthenticatedUser } from '../auth/strategies/jwt.strategy';
//import { ProgramByClassDto } from './dto/program-by-class.dto';
//import { GetProgramsQueryDto } from './dto/get-program.dto';

@Controller()
export class ProgramsController {
  constructor(private readonly programsService: ProgramsService) {}

  @Get()
  async getPrograms(
    @Request() req: { user: AuthenticatedUser },
    //@Query() params: GetProgramsQueryDto,
  ): Promise<ProgramWithRelations[] /*| ProgramByClassDto[]*/> {
    return await this.programsService.programsBySchool(req.user.schoolId);
  }

  @Get(':id')
  async getProgram(
    @Request() req: { user: AuthenticatedUser },
    @Param('id') id: number,
  ): Promise<ProgramWithRelations | null> {
    return this.programsService.programById(req.user.schoolId, id);
  }

  @Delete(':id')
  async deleteProgram(
    @Request() req: { user: AuthenticatedUser },
    @Param('id') id: number,
  ): Promise<Program | null> {
    return this.programsService.deleteProgram(req.user.schoolId, id);
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
