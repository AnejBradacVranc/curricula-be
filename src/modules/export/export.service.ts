import { Injectable, NotFoundException } from '@nestjs/common';
import { PDFService } from 'src/core/pdf/pdf.service';
import { PrismaService } from 'src/core/prisma/prisma.service';
import {
  TeacherDetailDto,
  teacherDetailSelect,
} from '../teacher/dto/teacher-detail.dto';
import { Content, TableCell, TDocumentDefinitions } from 'pdfmake/interfaces';
import { Teacher } from 'generated/prisma/client';
import { formatHours } from 'src/common/utils/number.util';
import { TeacherPdfBuilder } from './builders/teacher-pdf.builder';

@Injectable()
export class ExportService {
  constructor(
    private readonly pdfService: PDFService,
    private readonly prisma: PrismaService,
    private readonly teacherPdfBuilder: TeacherPdfBuilder,
  ) {}

  async exportTeacher(schoolId: number, teacherId: number): Promise<Buffer> {
    const teacher = await this.prisma.teacher.findFirst({
      where: { id: teacherId, schoolId },
      select: teacherDetailSelect,
    });

    if (!teacher) {
      throw new NotFoundException('Teacher not found for this school');
    }

    return await this.pdfService.createBuffer(
      this.teacherPdfBuilder.buildDetail(teacher),
    );
  }

  async exportTeachers(
    schoolId: number,
    teacherIds: number[],
  ): Promise<Buffer> {
    const teachers = await this.prisma.teacher.findMany({
      where: { id: { in: teacherIds }, schoolId },
    });

    if (teachers.length !== teacherIds.length) {
      throw new NotFoundException('Not all provided teachers could be found');
    }

    if (!teachers) {
      throw new NotFoundException('Teachers not found for this school');
    }

    return await this.pdfService.createBuffer(
      this.teacherPdfBuilder.buildList(teachers),
    );
  }
}
