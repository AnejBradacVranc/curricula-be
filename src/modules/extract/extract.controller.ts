import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileValidationPipe } from 'src/core/validation/fileValidationPipe';
import { ExtractTeacherSchema } from '../teacher/dto/create-teacher.schema';
import { ExtractService } from './extract.service';

@Controller()
export class ExtractController {
  constructor(private readonly extractService: ExtractService) {}

  @Post('program')
  @UseInterceptors(FileInterceptor('file'))
  async extractProgram(
    @UploadedFile(new FileValidationPipe()) file: Express.Multer.File,
  ): Promise<void> {
    return this.extractService.extractProgram(file);
  }

  @Post('teachers')
  @UseInterceptors(FileInterceptor('file'))
  async extractTeachers(
    @UploadedFile(new FileValidationPipe()) file: Express.Multer.File,
  ): Promise<ExtractTeacherSchema[]> {
    return this.extractService.extractTeachers(file);
  }

  @Post('subjects')
  @UseInterceptors(FileInterceptor('file'))
  async extractSubjects(
    @UploadedFile(new FileValidationPipe()) file: Express.Multer.File,
  ): Promise<void> {
    return this.extractService.extractSubjects(file);
  }
}
