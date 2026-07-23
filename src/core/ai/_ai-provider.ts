import { z } from 'zod';

export abstract class AiProvider {
  abstract generateResponse<T>(
    prompt: string,
    schema: z.ZodType<T>,
    systemPrompt: string,
    file?: Express.Multer.File,
  ): Promise<T | null>;
}
