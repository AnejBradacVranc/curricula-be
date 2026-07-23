import { z } from 'zod';

/** Zod mirror of CreateTeacherDto for AI structured output. */
export const createTeacherSchema = z.object({
  name: z.string().min(1),
  surname: z.string().min(1),
  email: z.string().email(),
  assignedHours: z.number(),
  color: z
    .string()
    .regex(/^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/)
    .nullable(),
});

export const importTeachersSchema = z.object({
  teachers: z.array(createTeacherSchema),
});

export type CreateTeacherSchema = z.infer<typeof createTeacherSchema>;
export type ImportTeachersSchema = z.infer<typeof importTeachersSchema>;
