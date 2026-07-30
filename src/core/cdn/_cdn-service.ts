export abstract class CDNService {
  abstract uploadFile(path: string, file: Express.Multer.File): Promise<string>;

  abstract uploadImageToFolder(
    schoolId: number,
    folder: string,
    fileName: string,
    file: Express.Multer.File,
  ): Promise<string>;
}
