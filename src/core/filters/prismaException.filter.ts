import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AbstractHttpAdapter } from '@nestjs/core';
import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
  PrismaClientRustPanicError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/client';

function getUniqueConstraintMessage(
  error: PrismaClientKnownRequestError,
): string {
  const meta = error.meta as
    | {
        modelName?: string;
        target?: string[];
        driverAdapterError?: {
          cause?: { constraint?: { fields?: string[] } };
        };
      }
    | undefined;

  const fields =
    meta?.driverAdapterError?.cause?.constraint?.fields ?? meta?.target ?? [];
  const model = meta?.modelName?.toLowerCase() ?? 'record';

  if (fields.length === 1) {
    return `A ${model} with this ${fields[0]} already exists`;
  }

  return `A ${model} with these values already exists`;
}

@Catch()
export class PrismaExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: AbstractHttpAdapter) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const body = exception.getResponse();
      this.httpAdapterHost.reply(response, body, status);
      return;
    }

    let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof PrismaClientKnownRequestError) {
      httpStatus =
        exception.code === 'P2002'
          ? HttpStatus.CONFLICT
          : HttpStatus.BAD_REQUEST;
      message =
        exception.code === 'P2002'
          ? getUniqueConstraintMessage(exception)
          : exception.message;
    } else if (exception instanceof PrismaClientValidationError) {
      httpStatus = HttpStatus.UNPROCESSABLE_ENTITY;
      message = exception.message;
    } else if (
      exception instanceof PrismaClientRustPanicError ||
      exception instanceof PrismaClientUnknownRequestError ||
      exception instanceof PrismaClientInitializationError
    ) {
      httpStatus = HttpStatus.BAD_REQUEST;
      message = exception.message;
    }

    this.httpAdapterHost.reply(
      response,
      {
        statusCode: httpStatus,
        message,
        error: HttpStatus[httpStatus],
      },
      httpStatus,
    );
  }
}
