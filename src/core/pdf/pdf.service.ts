import { Injectable, OnModuleInit } from '@nestjs/common';
import { Teacher } from 'generated/prisma/client';
import pdfMake from 'pdfmake';
import type {
  Content,
  TDocumentDefinitions,
  TableCell,
} from 'pdfmake/interfaces';

const HELVETICA_FONTS = {
  Helvetica: {
    normal: 'Helvetica',
    bold: 'Helvetica-Bold',
    italics: 'Helvetica-Oblique',
    bolditalics: 'Helvetica-BoldOblique',
  },
};

@Injectable()
export class PDFService implements OnModuleInit {
  onModuleInit() {
    pdfMake.setFonts(HELVETICA_FONTS);
    pdfMake.setUrlAccessPolicy(() => false);
    pdfMake.setLocalAccessPolicy(() => false);
  }

  async generateTeacherPDF(teacher: Teacher): Promise<Buffer> {
    return await this.createBuffer(this.buildTeacherDocument(teacher));
  }

  async generateTeachersPDF(teachers: Teacher[]): Promise<Buffer> {
    return await this.createBuffer(this.buildTeachersDocument(teachers));
  }

  private async createBuffer(
    docDefinition: TDocumentDefinitions,
  ): Promise<Buffer> {
    return await pdfMake.createPdf(docDefinition).getBuffer();
  }

  private buildTeacherDocument(teacher: Teacher): TDocumentDefinitions {
    return {
      info: {
        title: `Teacher – ${teacher.name} ${teacher.surname}`,
        author: 'Curricula',
      },
      defaultStyle: {
        font: 'Helvetica',
        fontSize: 11,
      },
      content: [
        { text: 'Teacher export', style: 'header' },
        { text: ' ', margin: [0, 4, 0, 4] },
        ...this.teacherDetailContent(teacher),
      ],
      styles: {
        header: { fontSize: 18, bold: true },
        section: { fontSize: 13, bold: true, margin: [0, 12, 0, 6] },
        label: { bold: true },
      },
    };
  }

  private buildTeachersDocument(teachers: Teacher[]): TDocumentDefinitions {
    return {
      info: {
        title: 'Teachers export',
        author: 'Curricula',
      },
      defaultStyle: {
        font: 'Helvetica',
        fontSize: 10,
      },
      content: [
        { text: 'Teachers export', style: 'header' },
        { text: `Total: ${teachers.length}`, margin: [0, 4, 0, 12] },
        {
          table: {
            headerRows: 1,
            widths: ['*', '*', 'auto', 'auto', 'auto', 'auto'],
            body: [
              this.teachersTableHeader(),
              ...teachers.map((teacher) => this.teachersTableRow(teacher)),
            ],
          },
          layout: 'lightHorizontalLines',
        },
      ],
      styles: {
        header: { fontSize: 18, bold: true },
        tableHeader: { bold: true, fillColor: '#eeeeee' },
      },
    };
  }

  private teacherDetailContent(teacher: Teacher): Content[] {
    return [
      { text: 'Profile', style: 'section' },
      {
        columns: [
          { text: [{ text: 'Name: ', style: 'label' }, teacher.name] },
          { text: [{ text: 'Surname: ', style: 'label' }, teacher.surname] },
        ],
        columnGap: 16,
      },
      {
        text: [{ text: 'Email: ', style: 'label' }, teacher.email],
        margin: [0, 4, 0, 0],
      },
      { text: 'Hours', style: 'section' },
      {
        ul: [
          `Assigned: ${this.formatHours(teacher.assignedHours)}`,
          `Additional activities: ${this.formatHours(teacher.additionalActivityHours)}`,
          `Total: ${this.formatHours(teacher.totalHours)}`,
        ],
      },
      // TODO: assignments / additional activities when richer DTO is passed in
    ];
  }

  private teachersTableHeader(): TableCell[] {
    return [
      { text: 'Name', style: 'tableHeader' },
      { text: 'Surname', style: 'tableHeader' },
      { text: 'Email', style: 'tableHeader' },
      { text: 'Assigned', style: 'tableHeader' },
      { text: 'Additional', style: 'tableHeader' },
      { text: 'Total', style: 'tableHeader' },
    ];
  }

  private teachersTableRow(teacher: Teacher): TableCell[] {
    return [
      teacher.name,
      teacher.surname,
      teacher.email,
      this.formatHours(teacher.assignedHours),
      this.formatHours(teacher.additionalActivityHours),
      this.formatHours(teacher.totalHours),
    ];
  }

  private formatHours(value: Teacher['assignedHours']): string {
    return Number(value).toFixed(2);
  }
}
