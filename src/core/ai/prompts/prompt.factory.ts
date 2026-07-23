import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { Injectable, InternalServerErrorException } from '@nestjs/common';

export enum ImportPromptKind {
  Teachers = 'teachers',
  Program = 'program',
  Subjects = 'subjects',
}

export type PromptPair = {
  system: string;
  user: string;
};

@Injectable()
export class PromptFactory {
  private readonly cache = new Map<string, string>();

  getPrompts(promptKind: ImportPromptKind) {
    return this.getImportPrompts(promptKind);
  }

  getImportPrompts(kind: ImportPromptKind): PromptPair {
    return {
      system: this.load(`${kind}.system.md`),
      user: this.load('user.md'),
    };
  }

  private load(filename: string): string {
    const cached = this.cache.get(filename);
    if (cached !== undefined) {
      return cached;
    }

    try {
      const content = readFileSync(join(__dirname, filename), 'utf8').trim();
      this.cache.set(filename, content);
      return content;
    } catch {
      throw new InternalServerErrorException(
        `Prompt datoteke ni bilo mogoče naložiti: ${filename}`,
      );
    }
  }
}
