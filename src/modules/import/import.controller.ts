import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileValidationPipe } from 'src/core/validation/fileValidationPipe';
import { CreateTeacherDto } from '../teacher/dto/create-teacher.dto';
import { ImportService } from './import.service';

@Controller()
export class ImportController {
  constructor(private readonly importService: ImportService) {}

  @Post('program')
  @UseInterceptors(FileInterceptor('file'))
  async importProgram(
    @UploadedFile(new FileValidationPipe()) file: Express.Multer.File,
  ): Promise<void> {
    return this.importService.importProgram(file);
  }

  @Post('teachers')
  @UseInterceptors(FileInterceptor('file'))
  async importTeachers(
    @UploadedFile(new FileValidationPipe()) file: Express.Multer.File,
  ): Promise<CreateTeacherDto[]> {
    return this.importService.importTeachers(file);
  }

  @Post('subjects')
  @UseInterceptors(FileInterceptor('file'))
  async importSubjects(
    @UploadedFile(new FileValidationPipe()) file: Express.Multer.File,
  ): Promise<void> {
    return this.importService.importSubjects(file);
  }
}
