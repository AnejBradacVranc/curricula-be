import {
  Controller,
  Post,
  Request,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileValidationPipe } from 'src/core/validation/fileValidationPipe';
import { AuthenticatedUser } from '../auth/strategies/jwt.strategy';
import { ResolvedExtractProgram } from '../program/dto/extract-program.schema';
import { ExtractTeacherSchema } from '../teacher/dto/create-teacher.schema';
import { ExtractService } from './extract.service';

@Controller()
export class ExtractController {
  constructor(private readonly extractService: ExtractService) {}

  @Post('program')
  @UseInterceptors(FileInterceptor('file'))
  async extractProgram(
    @Request() req: { user: AuthenticatedUser },
    @UploadedFile(new FileValidationPipe()) file: Express.Multer.File,
  ): Promise<ResolvedExtractProgram> {
    return this.extractService.extractProgram(req.user.schoolId, file);
  }

  @Post('teachers')
  @UseInterceptors(FileInterceptor('file'))
  async extractTeachers(
    @UploadedFile(new FileValidationPipe()) file: Express.Multer.File,
  ): Promise<ExtractTeacherSchema[]> {
    return this.extractService.extractTeachers(file);
  }
}
