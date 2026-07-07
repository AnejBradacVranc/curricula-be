import { Prisma } from 'generated/prisma/client';

export const teacherDetailSelect = {
  id: true,
  name: true,
  surname: true,
  email: true,
  schoolId: true,
  assignedHours: true,
  assignments: {
    select: {
      class: {
        select: {
          label: { select: { label: true } },
          programYear: {
            select: {
              numWeeks: true,
              year: { select: { name: true } },
            },
          },
        },
      },
      programSubject: {
        select: {
          requiredHours: true,
          subject: {
            select: {
              name: true,
              category: { select: { name: true } },
            },
          },
        },
      },
    },
  },
} as const satisfies Prisma.TeacherSelect;

export type TeacherDetailDto = Prisma.TeacherGetPayload<{
  select: typeof teacherDetailSelect;
}>;
