import { Injectable, NotFoundException } from '@nestjs/common';
import { PDFService } from 'src/core/pdf/pdf.service';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { teacherDetailSelect } from '../teacher/dto/teacher-detail.dto';
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
    teacherIds?: number[],
  ): Promise<Buffer> {
    const hasSelection = teacherIds && teacherIds.length > 0;

    const teachers = await this.prisma.teacher.findMany({
      where: hasSelection ? { id: { in: teacherIds }, schoolId } : { schoolId },
      orderBy: [{ surname: 'asc' }, { name: 'asc' }],
    });

    if (hasSelection && teachers.length !== teacherIds!.length) {
      throw new NotFoundException('Not all provided teachers could be found');
    }

    if (teachers.length === 0) {
      throw new NotFoundException('No teachers found for this school');
    }

    return await this.pdfService.createBuffer(
      this.teacherPdfBuilder.buildList(teachers),
    );
  }
}
