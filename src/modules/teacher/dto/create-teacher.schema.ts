import { z } from 'zod';

/** Fields extracted from documents (PDF/CSV/Excel/Word). */
export const extractTeacherSchema = z.object({
  name: z.string().min(1),
  surname: z.string().min(1),
  email: z.string().email(),
});

export const extractTeachersSchema = z.object({
  teachers: z.array(extractTeacherSchema),
});

export type ExtractTeacherSchema = z.infer<typeof extractTeacherSchema>;
export type ExtractTeachersSchema = z.infer<typeof extractTeachersSchema>;
