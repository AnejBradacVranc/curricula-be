import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { Injectable, InternalServerErrorException } from '@nestjs/common';

export enum ExtractPromptKind {
  Teachers = 'teachers',
  Program = 'program',
}

export type PromptPair = {
  system: string;
  user: string;
};

const readPrompt = (relativePath: string): string =>
  readFileSync(resolve(process.cwd(), relativePath), 'utf-8');

@Injectable()
export class PromptFactory {
  private readonly cache = new Map<string, string>();

  getPrompts(promptKind: ExtractPromptKind) {
    return this.getExtractPrompts(promptKind);
  }

  getExtractPrompts(kind: ExtractPromptKind): PromptPair {
    return {
      system: this.load(`prompts/${kind}.system.md`),
      user: this.load('prompts/user.md'),
    };
  }

  private load(relativePath: string): string {
    const cached = this.cache.get(relativePath);
    if (cached !== undefined) {
      return cached;
    }

    try {
      const content = readPrompt(relativePath).trim();
      this.cache.set(relativePath, content);
      return content;
    } catch {
      throw new InternalServerErrorException(
        `Failed to load prompt file: ${relativePath}`,
      );
    }
  }
}
