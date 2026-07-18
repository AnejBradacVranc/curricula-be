import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { Class } from 'generated/prisma/client';
import { ClassesService } from './class.service';
import { AuthenticatedUser } from '../auth/strategies/jwt.strategy';
import { ClassesOfProgramDto } from './dto/classes-of-program.dto';
import { CreateClassDto } from './dto/create-class.dto';
import { DeleteClassDto } from './dto/delete-class.dto';

@Controller()
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Get()
  async getClasses(
    @Request() req: { user: AuthenticatedUser },
    @Query() { programId }: ClassesOfProgramDto,
  ): Promise<Class[]> {
    return this.classesService.findAll(req.user.schoolId, programId);
  }

  @Post()
  async createClass(@Body() createClassDto: CreateClassDto): Promise<Class> {
    return this.classesService.createClass(createClassDto);
  }

  @Delete()
  async deleteClass(
    @Request() req: { user: AuthenticatedUser },
    @Body() deleteClassDto: DeleteClassDto,
  ): Promise<void> {
    return this.classesService.deleteClass(
      req.user.schoolId,
      deleteClassDto,
    );
  }
}
