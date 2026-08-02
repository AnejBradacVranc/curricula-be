import { Injectable, NotFoundException } from '@nestjs/common';
import { PDFService } from 'src/core/pdf/pdf.service';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { teacherDetailSelect } from '../teacher/dto/teacher-detail.dto';

@Injectable()
export class ExportService {
  constructor(
    private readonly pdfService: PDFService,
    private readonly prisma: PrismaService,
  ) {}

  async exportTeacher(schoolId: number, teacherId: number): Promise<Buffer> {
    const teacher = await this.prisma.teacher.findFirst({
      where: { id: teacherId, schoolId },
      select: teacherDetailSelect,
    });

    if (!teacher) {
      throw new NotFoundException('Teacher not found for this school');
    }

    return await this.pdfService.generateTeacherPDF(teacher);
  }
}
