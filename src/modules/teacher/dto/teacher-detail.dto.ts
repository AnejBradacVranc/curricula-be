import { Prisma } from 'generated/prisma/client';

export const teacherDetailSelect = {
  id: true,
  name: true,
  surname: true,
  email: true,
  schoolId: true,
  color: true,
  assignedHours: true,
  additionalActivityHours: true,
  totalHours: true,
  assignments: {
    select: {
      class: {
        select: {
          label: true,
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
              abbrevation: true,
              category: { select: { name: true } },
            },
          },
        },
      },
    },
  },
  additionalActivityAssignments: {
    select: {
      additionalActivityId: true,
      hoursAmount: true,
      additionalActivity: { select: { name: true } },
    },
  },
} as const satisfies Prisma.TeacherSelect;

export type TeacherDetailDto = Prisma.TeacherGetPayload<{
  select: typeof teacherDetailSelect;
}>;
