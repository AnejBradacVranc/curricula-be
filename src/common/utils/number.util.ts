import { Decimal } from '@prisma/client/runtime/client';

export function formatHours(
  value: Decimal | number | string,
  fractionDigits: number = 2,
): string {
  return Number(value).toFixed(fractionDigits);
}
