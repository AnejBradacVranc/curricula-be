import { Body, Controller, Delete, Patch, Post, Request } from '@nestjs/common';
import { CreateProgramYearDto } from './dto/create-program-year.dto';
import { UpdateProgramYearDto } from './dto/update-program-year.dto';
import {
  ProgramYearsService,
  ProgramYearWithRelations,
} from './program-year.service';
import { AuthenticatedUser } from '../auth/strategies/jwt.strategy';
import { DeleteProgramYearDto } from './dto/delete-program-year.dto';
import { ProgramYear } from 'generated/prisma/client';

@Controller()
export class ProgramYearsController {
  constructor(private readonly programYearsService: ProgramYearsService) {}

  @Post()
  async createProgramYear(
    @Request() req: { user: AuthenticatedUser },
    @Body() createProgramYearDto: CreateProgramYearDto,
  ): Promise<ProgramYearWithRelations> {
    return this.programYearsService.createProgramYear(
      req.user.schoolId,
      createProgramYearDto,
    );
  }

  @Patch()
  async updateProgramYear(
    @Request() req: { user: AuthenticatedUser },
    @Body() updateProgramYearDto: UpdateProgramYearDto,
  ): Promise<ProgramYearWithRelations> {
    return this.programYearsService.updateProgramYear(
      req.user.schoolId,
      updateProgramYearDto,
    );
  }

  @Delete()
  async deleteProgramYear(
    @Request() req: { user: AuthenticatedUser },
    @Body() deleteProgramYearDto: DeleteProgramYearDto,
  ): Promise<ProgramYear> {
    return this.programYearsService.deleteProgramYear(
      req.user.schoolId,
      deleteProgramYearDto,
    );
  }
}
