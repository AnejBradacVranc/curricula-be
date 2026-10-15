import { z } from 'zod';

import { Injectable } from '@nestjs/common';
import { generateText, Output, type UserContent } from 'ai';
import { openai } from '@ai-sdk/openai';

import { AiProvider } from './_ai-provider';
import { PromptFactory } from './prompts/prompt.factory';

type OpenAIResponsesModelId = Parameters<typeof openai.responses>[0];

@Injectable()
export class AiService implements AiProvider {
  constructor(readonly promptFactory: PromptFactory) {}

  private getModel(modelId?: OpenAIResponsesModelId) {
    return openai.responses(modelId ?? 'gpt-4o-mini');
  }

  async generateResponse<T>(
    prompt: string,
    schema: z.ZodType<T>,
    systemPrompt: string,
    file?: Express.Multer.File,
    model?: OpenAIResponsesModelId,
  ): Promise<T | null> {
    try {
      const content: UserContent = [{ type: 'text', text: prompt }];

      if (file) {
        content.push({
          type: 'file',
          data: file.buffer,
          mediaType: file.mimetype || 'application/pdf',
          filename: file.originalname,
        });
      }

      const { output } = await generateText({
        model: this.getModel(model),
        system: systemPrompt,
        output: Output.object({ schema }),
        messages: [{ role: 'user', content }],
      });

      return output;
    } catch {
      return null;
    }
  }
}
