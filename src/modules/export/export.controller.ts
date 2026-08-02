import {
  Controller,
  Get,
  Header,
  Param,
  Request,
  StreamableFile,
} from '@nestjs/common';
import { AuthenticatedUser } from '../auth/strategies/jwt.strategy';
import { ExportService } from './export.service';

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
}
