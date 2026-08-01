import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import * as BunnyStorageSDK from '@bunny.net/storage-sdk';
import { CDNService } from './_cdn-service';

function bufferToReadableStream(buffer: Buffer): ReadableStream<Uint8Array> {
  return new ReadableStream({
    start(controller) {
      controller.enqueue(new Uint8Array(buffer));
      controller.close();
    },
  });
}

@Injectable()
export class BunnyCDNService implements CDNService {
  private readonly logger = new Logger(BunnyCDNService.name);
  private readonly storageZone: BunnyStorageSDK.zone.StorageZone;
  private readonly cdnBaseUrl: string;

  constructor() {
    const storageZoneName = process.env.STORAGE_ZONE;
    const accessKey = process.env.STORAGE_ACCESS_KEY;
    const cdnBaseUrl = process.env.CDN_BASE_URL?.replace(/\/+$/, '');

    if (!storageZoneName || !accessKey || !cdnBaseUrl) {
      throw new Error(
        'Missing Bunny CDN credentials (STORAGE_ZONE, STORAGE_ACCESS_KEY, CDN_BASE_URL).',
      );
    }

    this.cdnBaseUrl = cdnBaseUrl;
    this.storageZone = BunnyStorageSDK.zone.connect_with_accesskey(
      BunnyStorageSDK.regions.StorageRegion.Falkenstein,
      storageZoneName,
      accessKey,
    );
  }

  async uploadImageToFolder(
    schoolId: number,
    folder: string,
    fileName: string,
    file: Express.Multer.File,
  ): Promise<string> {
    const safeName = fileName.replace(/[^a-zA-Z0-9_-]/g, '');
    const path = `/${schoolId}/${folder}/${safeName}.jpg`;
    return this.uploadFile(path, file);
  }

  async removeFile(path: string): Promise<void> {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;

    try {
      const uploaded = await BunnyStorageSDK.file.remove(
        this.storageZone,
        path,
      );

      if (!uploaded) {
        throw new InternalServerErrorException(
          'Bunny CDN rejected the file upload.',
        );
      }

      return;
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw error;
      }

      this.logger.error(
        `Failed to remove file from Bunny CDN at path "${normalizedPath}"`,
        error instanceof Error ? error.stack : undefined,
      );

      throw new InternalServerErrorException('Failed to remove file from CDN.');
    }
  }

  async uploadFile(path: string, file: Express.Multer.File): Promise<string> {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;

    try {
      const uploaded = await BunnyStorageSDK.file.upload(
        this.storageZone,
        normalizedPath,
        bufferToReadableStream(file.buffer),
        {
          contentType: file.mimetype || 'application/octet-stream',
        },
      );

      if (!uploaded) {
        throw new InternalServerErrorException(
          'Bunny CDN rejected the file upload.',
        );
      }

      return `${this.cdnBaseUrl}${normalizedPath}`;
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw error;
      }

      this.logger.error(
        `Failed to upload file to Bunny CDN at path "${normalizedPath}"`,
        error instanceof Error ? error.stack : undefined,
      );

      throw new InternalServerErrorException('Failed to upload file to CDN.');
    }
  }
}
