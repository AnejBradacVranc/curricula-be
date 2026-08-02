import { Injectable, NotFoundException } from '@nestjs/common';
import { PDFService } from 'src/core/pdf/pdf.service';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class ExportService {
  constructor(
    private readonly pdfService: PDFService,
    private readonly prisma: PrismaService,
  ) {}

  async exportTeacher(schoolId: number, teacherId: number): Promise<Buffer> {
    const teacher = await this.prisma.teacher.findUnique({
      where: { id: teacherId, schoolId },
    });

    if (!teacher) {
      throw new NotFoundException('Teacher not found for this school');
    }

    return await this.pdfService.generateTeacherPDF(teacher);
  }
}
