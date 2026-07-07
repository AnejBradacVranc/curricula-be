import { Prisma } from 'generated/prisma/client';

type TeacherHoursClient = {
  teacher: {
    findUniqueOrThrow: (args: {
      where: { id: number };
      select: { assignedHours: true; additionalActivityHours: true };
    }) => Promise<{
      assignedHours: Prisma.Decimal;
      additionalActivityHours: Prisma.Decimal;
    }>;
    update: (args: {
      where: { id: number };
      data: { totalHours: Prisma.Decimal };
    }) => Promise<unknown>;
  };
};

export function teacherAssignmentHours(
  requiredHours: Prisma.Decimal,
  numWeeks: number,
): Prisma.Decimal {
  return requiredHours.div(35).mul(numWeeks);
}

export async function syncTeacherTotalHours(
  client: TeacherHoursClient,
  teacherId: number,
): Promise<void> {
  const teacher = await client.teacher.findUniqueOrThrow({
    where: { id: teacherId },
    select: { assignedHours: true, additionalActivityHours: true },
  });

  await client.teacher.update({
    where: { id: teacherId },
    data: {
      totalHours: teacher.assignedHours.add(teacher.additionalActivityHours),
    },
  });
}
