import {
  Body,
  Controller,
  Get,
  Header,
  Param,
  Request,
  StreamableFile,
} from '@nestjs/common';
import { AuthenticatedUser } from '../auth/strategies/jwt.strategy';
import { ExportService } from './export.service';
import { ExportTeachersQueryDto } from './dto/export-teachers-dto';

@Controller()
export class ExportController {
  constructor(private readonly exportService: ExportService) {}

  @Get('teachers/:id')
  @Header('Content-Type', 'application/pdf')
  async exportTeacher(
    @Request() req: { user: AuthenticatedUser },
    @Param('id') id: number,
  ): Promise<StreamableFile> {
    const pdfBuffer = await this.exportService.exportTeacher(
      req.user.schoolId,
      id,
    );

    return new StreamableFile(pdfBuffer, {
      type: 'application/pdf',
      disposition: `attachment; filename="teacher-${id}.pdf"`,
    });
  }

  @Get('teachers')
  @Header('Content-Type', 'application/pdf')
  async exportTeachers(
    @Request() req: { user: AuthenticatedUser },
    @Body() { ids }: ExportTeachersQueryDto,
  ): Promise<StreamableFile> {
    const pdfBuffer = await this.exportService.exportTeachers(
      req.user.schoolId,
      ids,
    );

    return new StreamableFile(pdfBuffer, {
      type: 'application/pdf',
      disposition: `attachment; filename="teachers.pdf"`,
    });
  }
}
