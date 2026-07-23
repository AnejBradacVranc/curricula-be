import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  transform(
    value: Express.Multer.File | undefined,
    _metadata: ArgumentMetadata,
  ): Express.Multer.File {
    if (!value) {
      throw new BadRequestException('Datoteka je obvezna.');
    }

    const maxSizeBytes = 200 * 1024;
    const isOkSize = value.size <= maxSizeBytes;

    if (!isOkSize) {
      throw new BadRequestException(
        'Datoteka PDF presega dovoljeno velikost (200 KB).',
      );
    }

    const mimeType = value.mimetype?.toLowerCase() ?? '';
    const originalName = value.originalname?.toLowerCase() ?? '';
    const isPdfMime = mimeType === 'application/pdf';
    const isPdfExtension = originalName.endsWith('.pdf');

    if (!isPdfMime && !isPdfExtension) {
      throw new BadRequestException('Dovoljene so samo PDF datoteke.');
    }

    if (!value.buffer?.length) {
      throw new BadRequestException(
        'Datoteka nima vsebine v spominu (manjka buffer).',
      );
    }

    const header = value.buffer.subarray(0, 4).toString('utf8');
    if (header !== '%PDF') {
      throw new BadRequestException('Datoteka ni veljaven PDF.');
    }

    return value;
  }
}
