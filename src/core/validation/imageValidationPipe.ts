import { extname } from 'node:path';
import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

/** Profile photos stay small — 2 MB is enough for avatars. */
const DEFAULT_MAX_SIZE_BYTES = 2 * 1024 * 1024;

const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp']);

const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

type ImageKind = 'jpeg' | 'png' | 'webp';

const MIME_TO_KIND: Record<string, ImageKind> = {
  'image/jpeg': 'jpeg',
  'image/png': 'png',
  'image/webp': 'webp',
};

const EXT_TO_KIND: Record<string, ImageKind> = {
  '.jpg': 'jpeg',
  '.jpeg': 'jpeg',
  '.png': 'png',
  '.webp': 'webp',
};

export type ImageValidationOptions = {
  optional?: boolean;
  maxSizeBytes?: number;
};

function detectImageKind(buffer: Buffer): ImageKind | null {
  if (buffer.length < 12) {
    return null;
  }

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return 'jpeg';
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return 'png';
  }

  // WEBP: RIFF....WEBP
  if (
    buffer.toString('ascii', 0, 4) === 'RIFF' &&
    buffer.toString('ascii', 8, 12) === 'WEBP'
  ) {
    return 'webp';
  }

  return null;
}

@Injectable()
export class ImageValidationPipe implements PipeTransform {
  private readonly optional: boolean;
  private readonly maxSizeBytes: number;

  constructor(options: ImageValidationOptions = {}) {
    this.optional = options.optional ?? false;
    this.maxSizeBytes = options.maxSizeBytes ?? DEFAULT_MAX_SIZE_BYTES;
  }

  transform(
    value: Express.Multer.File | undefined,
    _metadata: ArgumentMetadata,
  ): Express.Multer.File | undefined {
    if (!value) {
      if (this.optional) {
        return undefined;
      }
      throw new BadRequestException('Image is required.');
    }

    if (!value.buffer?.length) {
      throw new BadRequestException(
        'Image has no content in memory (missing buffer).',
      );
    }

    if (value.size <= 0 || value.buffer.length <= 0) {
      throw new BadRequestException('Image file is empty.');
    }

    if (value.size > this.maxSizeBytes) {
      const maxMb = Math.round((this.maxSizeBytes / (1024 * 1024)) * 10) / 10;
      throw new BadRequestException(
        `Image exceeds the maximum allowed size (${maxMb} MB).`,
      );
    }

    const mimeType = value.mimetype?.toLowerCase().trim() ?? '';
    const extension = extname(value.originalname ?? '')
      .toLowerCase()
      .trim();

    if (!mimeType || !ALLOWED_MIME_TYPES.has(mimeType)) {
      throw new BadRequestException(
        'Only JPEG, PNG, and WebP images are allowed.',
      );
    }

    if (!extension || !ALLOWED_EXTENSIONS.has(extension)) {
      throw new BadRequestException(
        'Image filename must end with .jpg, .jpeg, .png, or .webp.',
      );
    }

    const mimeKind = MIME_TO_KIND[mimeType];
    const extKind = EXT_TO_KIND[extension];

    if (!mimeKind || !extKind || mimeKind !== extKind) {
      throw new BadRequestException(
        'Image MIME type and file extension do not match.',
      );
    }

    const magicKind = detectImageKind(value.buffer);
    if (!magicKind) {
      throw new BadRequestException(
        'File content is not a valid JPEG, PNG, or WebP image.',
      );
    }

    if (magicKind !== mimeKind) {
      throw new BadRequestException(
        'Image content does not match the declared file type.',
      );
    }

    return value;
  }
}
