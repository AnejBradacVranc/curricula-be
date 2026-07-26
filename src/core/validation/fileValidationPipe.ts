import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

const MAX_SIZE_BYTES = 200 * 1024;

const ALLOWED_EXTENSIONS = [
  '.pdf',
  '.csv',
  '.xls',
  '.xlsx',
  '.doc',
  '.docx',
] as const;

const ALLOWED_MIME_TYPES = new Set([
  'application/pdf',
  'text/csv',
  'application/csv',
  'text/plain',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

@Injectable()
export class FileValidationPipe implements PipeTransform {
  transform(
    value: Express.Multer.File | undefined,
    _metadata: ArgumentMetadata,
  ): Express.Multer.File {
    if (!value) {
      throw new BadRequestException('File is required.');
    }

    if (value.size > MAX_SIZE_BYTES) {
      throw new BadRequestException(
        'File exceeds the maximum allowed size (200 KB).',
      );
    }

    const mimeType = value.mimetype?.toLowerCase() ?? '';
    const originalName = value.originalname?.toLowerCase() ?? '';
    const isAllowedExtension = ALLOWED_EXTENSIONS.some((ext) =>
      originalName.endsWith(ext),
    );
    const isAllowedMime = ALLOWED_MIME_TYPES.has(mimeType);

    if (!isAllowedMime || !isAllowedExtension) {
      throw new BadRequestException(
        'Only PDF, CSV, Excel (.xls, .xlsx), and Word (.doc, .docx) files are allowed.',
      );
    }

    if (!value.buffer?.length) {
      throw new BadRequestException(
        'File has no content in memory (missing buffer).',
      );
    }

    return value;
  }
}
