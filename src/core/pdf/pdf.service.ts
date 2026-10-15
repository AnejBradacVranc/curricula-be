import {
  Injectable,
  InternalServerErrorException,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { Teacher } from 'generated/prisma/client';
import pdfMake from 'pdfmake';
import type {
  Content,
  TDocumentDefinitions,
  TableCell,
} from 'pdfmake/interfaces';
import { TeacherDetailDto } from 'src/modules/teacher/dto/teacher-detail.dto';
import { Decimal } from '@prisma/client/runtime/client';

const nodeRequire = createRequire(__filename);
const ROBOTO_DIR = join(
  dirname(nodeRequire.resolve('pdfmake/package.json')),
  'fonts',
  'Roboto',
);

const FONTS = {
  Roboto: {
    normal: join(ROBOTO_DIR, 'Roboto-Regular.ttf'),
    bold: join(ROBOTO_DIR, 'Roboto-Medium.ttf'),
    italics: join(ROBOTO_DIR, 'Roboto-Italic.ttf'),
    bolditalics: join(ROBOTO_DIR, 'Roboto-MediumItalic.ttf'),
  },
};

@Injectable()
export class PDFService implements OnModuleInit {
  private readonly logger = new Logger(PDFService.name);

  onModuleInit() {
    pdfMake.setFonts(FONTS);
    pdfMake.setUrlAccessPolicy(() => false);
    pdfMake.setLocalAccessPolicy((filePath) => filePath.startsWith(ROBOTO_DIR));
  }

  // async generateTeacherPDF(teacher: TeacherDetailDto): Promise<Buffer> {
  //   return await this.createBuffer(this.buildTeacherDocument(teacher));
  // }

  // async generateTeachersPDF(teachers: Teacher[]): Promise<Buffer> {
  //   return await this.createBuffer(this.buildTeachersDocument(teachers));
  // }

  async createBuffer(docDefinition: TDocumentDefinitions): Promise<Buffer> {
    try {
      return await pdfMake.createPdf(docDefinition).getBuffer();
    } catch (error: any) {
      if (error instanceof InternalServerErrorException) {
        throw error;
      }

      this.logger.error(
        `Failed to generate PDF buffer`,
        error instanceof Error ? error.stack : undefined,
      );

      throw new InternalServerErrorException('Failed generate PDF export.');
    }
  }
}
