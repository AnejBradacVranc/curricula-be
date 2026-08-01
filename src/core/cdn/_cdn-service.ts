export abstract class CDNService {
  abstract uploadFile(path: string, file: Express.Multer.File): Promise<string>;

  abstract removeFile(path: string): Promise<void>;
}
