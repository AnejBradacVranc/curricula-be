import { z } from 'zod';

/** Raw AI extraction schema (names only — no DB IDs). */
const extractProgramSubjectSchema = z.object({
  name: z.string().min(1),
  abbrevation: z.string().min(1).nullable(),
  categoryName: z.string().min(1).nullable(),
  requiredHours: z.number(),
});

const extractProgramYearSchema = z.object({
  yearName: z.string().min(1),
  numWeeks: z.number().int().min(1),
  subjects: z.array(extractProgramSubjectSchema),
});

export const extractProgramSchema = z.object({
  name: z.string().min(1),
  years: z.array(extractProgramYearSchema),
});

export type ExtractProgramSubjectSchema = z.infer<
  typeof extractProgramSubjectSchema
>;
export type ExtractProgramYearSchema = z.infer<typeof extractProgramYearSchema>;
export type ExtractProgramSchema = z.infer<typeof extractProgramSchema>;

/** Resolved subject after matching against the school catalog. */
export type ResolvedExtractProgramSubject = ExtractProgramSubjectSchema & {
  subjectId: number | null;
  /** True when the subject does not exist yet and will be created on commit. */
  isNew: boolean;
  categoryId: number | null;
};

/** Resolved year after matching against the year catalog. */
export type ResolvedExtractProgramYear = {
  yearName: string;
  yearId: number | null;
  numWeeks: number;
  subjects: ResolvedExtractProgramSubject[];
};

/** Enriched extract response returned by the API. */
export type ResolvedExtractProgram = {
  name: string;
  years: ResolvedExtractProgramYear[];
};
