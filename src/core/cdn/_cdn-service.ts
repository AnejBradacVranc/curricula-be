export interface CDNService {
  uploadFile(path: string, file: Express.Multer.File): Promise<string>;

  removeFile(path: string): Promise<void>;
}
