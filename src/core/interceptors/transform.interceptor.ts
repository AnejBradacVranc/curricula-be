import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  StreamableFile,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

const TIMESTAMP_KEYS = new Set(['createdAt', 'updatedAt']);

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const proto = Object.getPrototypeOf(value) as object | null;
  return proto === Object.prototype || proto === null;
}

function omitTimestamps<T>(value: T): T {
  if (value === null || value === undefined) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => omitTimestamps(item)) as T;
  }

  if (!isPlainObject(value)) {
    return value;
  }

  const result: Record<string, unknown> = {};

  for (const [key, val] of Object.entries(value)) {
    if (TIMESTAMP_KEYS.has(key)) {
      continue;
    }
    result[key] = omitTimestamps(val);
  }

  return result as T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  { data: T } | StreamableFile
> {
  intercept(
    _context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<{ data: T } | StreamableFile> {
    return next.handle().pipe(
      map((data) => {
        if (data instanceof StreamableFile) {
          return data;
        }

        return { data: omitTimestamps(data) };
      }),
    );
  }
}
