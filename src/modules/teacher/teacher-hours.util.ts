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

export function teacherAssignmentHoursDelta(
  oldRequiredHours: Prisma.Decimal,
  newRequiredHours: Prisma.Decimal,
  oldNumWeeks: number,
  newNumWeeks: number,
): Prisma.Decimal {
  return teacherAssignmentHours(newRequiredHours, newNumWeeks).sub(
    teacherAssignmentHours(oldRequiredHours, oldNumWeeks),
  );
}

type TeacherAssignedHoursClient = TeacherHoursClient & {
  teacher: TeacherHoursClient['teacher'] & {
    update: (args: {
      where: { id: number; schoolId: number };
      data: { assignedHours: { increment: Prisma.Decimal } };
    }) => Promise<unknown>;
  };
};

export async function applyTeacherHourDeltas(
  client: TeacherAssignedHoursClient,
  schoolId: number,
  deltaByTeacher: Map<number, Prisma.Decimal>,
): Promise<void> {
  for (const [teacherId, delta] of deltaByTeacher) {
    if (delta.isZero()) {
      continue;
    }

    await client.teacher.update({
      where: { id: teacherId, schoolId },
      data: { assignedHours: { increment: delta } },
    });
    await syncTeacherTotalHours(client, teacherId);
  }
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
