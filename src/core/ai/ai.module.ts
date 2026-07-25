import { Global, Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { PromptFactory } from './prompts/prompt.factory';

@Module({
  providers: [PromptFactory, AiService],
  exports: [AiService],
})
export class AiModule {}
