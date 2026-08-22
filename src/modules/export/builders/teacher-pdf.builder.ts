import { Injectable } from '@nestjs/common';
import { Teacher } from 'generated/prisma/client';
import { Content, TableCell, TDocumentDefinitions } from 'pdfmake/interfaces';
import { formatHours } from 'src/common/utils/number.util';
import { TeacherDetailDto } from 'src/modules/teacher/dto/teacher-detail.dto';
import { PDFBuilder } from './_pdf-builder';

@Injectable()
export class TeacherPdfBuilder implements PDFBuilder<
  TeacherDetailDto,
  Teacher
> {
  buildDetail(teacher: TeacherDetailDto): TDocumentDefinitions {
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

  buildList(teachers: Teacher[]): TDocumentDefinitions {
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
          `Assigned: ${formatHours(teacher.assignedHours)}`,
          `Additional activities: ${formatHours(teacher.additionalActivityHours)}`,
          `Total: ${formatHours(teacher.totalHours)}`,
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
              formatHours(assignment.programSubject.requiredHours),
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
              formatHours(assignment.hoursAmount),
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
      formatHours(teacher.assignedHours),
      formatHours(teacher.additionalActivityHours),
      formatHours(teacher.totalHours),
    ];
  }
}
