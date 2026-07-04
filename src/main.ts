import { NestFactory } from '@nestjs/core';
import 'dotenv/config';
import { AppModule } from './app.module';
import { RequestMethod } from '@nestjs/common/enums';
import { ValidationPipe } from '@nestjs/common';
import { validationPipeOptions } from './core/validation/validationPipeOptions';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1', {
    exclude: [{ path: 'health', method: RequestMethod.GET }],
  });

  app.useGlobalPipes(new ValidationPipe(validationPipeOptions));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
