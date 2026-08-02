import { Module } from '@nestjs/common';
import { ExportController } from './export.controller';
import { ExportService } from './export.service';
import { PDFModule } from 'src/core/pdf/pdf.module';

@Module({
  imports: [PDFModule],
  controllers: [ExportController],
  providers: [ExportService],
})
export class ExportModule {}
