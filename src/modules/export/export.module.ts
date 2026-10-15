import { Module } from '@nestjs/common';
import { ExportController } from './export.controller';
import { ExportService } from './export.service';
import { PDFModule } from 'src/core/pdf/pdf.module';
import { TeacherPdfBuilder } from './builders/teacher-pdf.builder';

@Module({
  imports: [PDFModule],
  controllers: [ExportController],
  providers: [ExportService, TeacherPdfBuilder],
})
export class ExportModule {}
