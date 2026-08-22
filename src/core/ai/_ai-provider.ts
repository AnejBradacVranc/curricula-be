import { z } from 'zod';

export interface AiProvider {
  generateResponse<T>(
    prompt: string,
    schema: z.ZodType<T>,
    systemPrompt: string,
    file?: Express.Multer.File,
  ): Promise<T | null>;
}
