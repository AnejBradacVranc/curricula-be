import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
} from '@nestjs/common';
import { Program } from 'generated/prisma/client';
import { CreateProgramDto } from './dto/create-program.dto';
import { ImportProgramDto } from './dto/import-program.dto';
import { ProgramsService, ProgramWithRelations } from './program.service';
import { AuthenticatedUser } from '../auth/strategies/jwt.strategy';

@Controller()
export class ProgramsController {
  constructor(private readonly programsService: ProgramsService) {}

  @Get()
  async getPrograms(
    @Request() req: { user: AuthenticatedUser },
  ): Promise<ProgramWithRelations[]> {
    return await this.programsService.programs(req.user.schoolId);
  }

  @Post('import')
  async importProgram(
    @Request() req: { user: AuthenticatedUser },
    @Body() importProgramDto: ImportProgramDto,
  ): Promise<ProgramWithRelations> {
    return this.programsService.importProgram(
      req.user.schoolId,
      importProgramDto,
    );
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
