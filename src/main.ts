import { HttpAdapterHost, NestFactory, RouterModule } from '@nestjs/core';
import 'dotenv/config';
import { AppModule } from './app.module';
import { RequestMethod } from '@nestjs/common/enums';
import { ValidationPipe } from '@nestjs/common';
import { PrismaExceptionFilter } from './core/filters/prismaException.filter';
import { validationPipeOptions } from './core/validation/validationPipeOptions';
import { TransformInterceptor } from './core/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1', {
    exclude: [{ path: 'health', method: RequestMethod.GET }],
  });

  const { httpAdapter } = app.get(HttpAdapterHost);

  app.useGlobalPipes(new ValidationPipe(validationPipeOptions));
  app.useGlobalFilters(new PrismaExceptionFilter(httpAdapter));
  app.useGlobalInterceptors(new TransformInterceptor());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
