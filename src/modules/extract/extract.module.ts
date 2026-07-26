import { Module } from '@nestjs/common';
import { AiModule } from 'src/core/ai/ai.module';
import { ExtractController } from './extract.controller';
import { ExtractService } from './extract.service';

@Module({
  imports: [AiModule],
  controllers: [ExtractController],
  providers: [ExtractService],
})
export class ExtractModule {}
