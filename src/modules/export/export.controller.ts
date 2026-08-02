import {
  Controller,
  Get,
  Param,
  Request,
  StreamableFile,
} from '@nestjs/common';
import { AuthenticatedUser } from '../auth/strategies/jwt.strategy';
import { ExportService } from './export.service';

@Controller()
export class ExportController {
  constructor(private readonly exportService: ExportService) {}

  @Get('teacher/:id')
  async exportTeacher(
    @Request() req: { user: AuthenticatedUser },
    @Param('id') id: number,
  ): Promise<StreamableFile> {
    const pdfBuffer = await this.exportService.exportTeacher(
      req.user.schoolId,
      id,
    );
    return new StreamableFile(pdfBuffer);
  }
}
