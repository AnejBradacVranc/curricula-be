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
    pdfMake.setLocalAccessPolicy((filePath) =>
      filePath.startsWith(ROBOTO_DIR),
    );
  }

  async generateTeacherPDF(teacher: TeacherDetailDto): Promise<Buffer> {
    return await this.createBuffer(this.buildTeacherDocument(teacher));
  }

  async generateTeachersPDF(teachers: Teacher[]): Promise<Buffer> {
    return await this.createBuffer(this.buildTeachersDocument(teachers));
  }

  private async createBuffer(
    docDefinition: TDocumentDefinitions,
  ): Promise<Buffer> {
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

  private buildTeacherDocument(
    teacher: TeacherDetailDto,
  ): TDocumentDefinitions {
    return {
      info: {
        title: `Teacher – ${teacher.name} ${teacher.surname}`,
        author: 'Curricula',
      },
      defaultStyle: {
        font: 'Roboto',
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
        muted: { fontSize: 9, color: '#666666' },
        tableHeader: { bold: true, fillColor: '#eeeeee' },
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
        font: 'Roboto',
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

  private teacherDetailContent(teacher: TeacherDetailDto): Content[] {
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
      ...this.assignmentsContent(teacher),
      ...this.additionalActivitiesContent(teacher),
    ];
  }

  private assignmentsContent(teacher: TeacherDetailDto): Content[] {
    const header: Content = {
      text: `Assignments (${teacher.assignments.length})`,
      style: 'section',
    };

    if (teacher.assignments.length === 0) {
      return [header, { text: 'No subject assignments.', style: 'muted' }];
    }

    return [
      header,
      {
        table: {
          headerRows: 1,
          widths: ['*', 'auto', 'auto', 'auto', 'auto'],
          body: [
            [
              { text: 'Subject', style: 'tableHeader' },
              { text: 'Category', style: 'tableHeader' },
              { text: 'Year', style: 'tableHeader' },
              { text: 'Class', style: 'tableHeader' },
              { text: 'Hours/week', style: 'tableHeader' },
            ],
            ...teacher.assignments.map((assignment) => [
              assignment.programSubject.subject.name,
              assignment.programSubject.subject.category.name,
              assignment.class.programYear.year.name,
              assignment.class.label,
              this.formatHours(assignment.programSubject.requiredHours),
            ]),
          ],
        },
        layout: 'lightHorizontalLines',
      },
    ];
  }

  private additionalActivitiesContent(teacher: TeacherDetailDto): Content[] {
    const header: Content = {
      text: `Additional activities (${teacher.additionalActivityAssignments.length})`,
      style: 'section',
    };

    if (teacher.additionalActivityAssignments.length === 0) {
      return [header, { text: 'No additional activities.', style: 'muted' }];
    }

    return [
      header,
      {
        table: {
          headerRows: 1,
          widths: ['*', 'auto'],
          body: [
            [
              { text: 'Activity', style: 'tableHeader' },
              { text: 'Hours', style: 'tableHeader' },
            ],
            ...teacher.additionalActivityAssignments.map((assignment) => [
              assignment.additionalActivity.name,
              this.formatHours(assignment.hoursAmount),
            ]),
          ],
        },
        layout: 'lightHorizontalLines',
      },
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

  private formatHours(
    value: Teacher['assignedHours'] | number | string,
  ): string {
    return Number(value).toFixed(2);
  }
}
