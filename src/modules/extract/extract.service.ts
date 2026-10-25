import { BadRequestException, Injectable } from '@nestjs/common';
import { AiService } from 'src/core/ai/ai.service';
import { ExtractPromptKind } from 'src/core/ai/prompts/prompt.factory';
import { PrismaService } from 'src/core/prisma/prisma.service';
import {
  extractTeachersSchema,
  type ExtractTeacherSchema,
} from '../teacher/dto/create-teacher.schema';
import {
  extractProgramSchema,
  type ExtractProgramSchema,
  type ResolvedExtractProgram,
  type ResolvedExtractProgramSubject,
  type ResolvedExtractProgramYear,
} from '../program/dto/extract-program.schema';

@Injectable()
export class ExtractService {
  constructor(
    private readonly aiService: AiService,
    private readonly prisma: PrismaService,
  ) {}

  async extractTeachers(
    file: Express.Multer.File,
  ): Promise<ExtractTeacherSchema[]> {
    const { system, user } = this.aiService.promptFactory.getPrompts(
      ExtractPromptKind.Teachers,
    );

    const result = await this.aiService.generateResponse(
      user,
      extractTeachersSchema,
      system,
      file,
    );

    if (!result?.teachers?.length) {
      throw new BadRequestException(
        'Could not extract teachers from the document.',
      );
    }

    return result.teachers.map((teacher) => ({
      name: teacher.name.trim(),
      surname: teacher.surname.trim(),
      email: teacher.email?.trim().toLowerCase() || undefined,
    }));
  }

  async extractProgram(
    schoolId: number,
    file: Express.Multer.File,
  ): Promise<ResolvedExtractProgram> {
    const { system, user } = this.aiService.promptFactory.getPrompts(
      ExtractPromptKind.Program,
    );

    const result = await this.aiService.generateResponse(
      user,
      extractProgramSchema,
      system,
      file,
      'gpt-4o',
    );

    if (!result) {
      throw new BadRequestException(
        'Could not extract program from the document.',
      );
    }

    return this.resolveExtractProgram(schoolId, result);
  }

  private async resolveExtractProgram(
    schoolId: number,
    extracted: ExtractProgramSchema,
  ): Promise<ResolvedExtractProgram> {
    const [subjects, years] = await Promise.all([
      this.prisma.subject.findMany({
        where: { schoolId },
        include: { category: true },
      }),
      this.prisma.year.findMany(),
      this.prisma.category.findMany(),
    ]);

    const subjectByName = new Map(
      subjects.map((subject) => [this.normalize(subject.name), subject]),
    );
    const yearByNumber = new Map(years.map((year) => [year.year, year]));

    const yearsResolved: ResolvedExtractProgramYear[] = extracted.years.map(
      (year) => {
        const yearName = year.yearName.trim();
        const yearNumber = this.parseYearNumber(yearName);
        const matchedYear =
          yearNumber != null ? (yearByNumber.get(yearNumber) ?? null) : null;

        const subjectsResolved: ResolvedExtractProgramSubject[] =
          year.subjects.map((subject) => {
            const name = subject.name;

            const abbrevation = subject.abbrevation?.trim() || null;
            const matchedSubject = subjectByName.get(this.normalize(name));

            return {
              name,
              abbrevation,
              categoryName: matchedSubject?.category.name ?? null,
              requiredHours: subject.requiredHours,
              subjectId: matchedSubject?.id ?? null,
              isNew: !matchedSubject,
              categoryId: matchedSubject?.categoryId ?? null,
            };
          });

        return {
          yearName,
          yearId: matchedYear?.id ?? null,
          numWeeks: year.numWeeks,
          subjects: subjectsResolved,
        };
      },
    );

    return {
      name: extracted.name.trim(),
      years: yearsResolved,
    };
  }

  private normalize(value: string): string {
    return value.trim().toLowerCase();
  }

  private parseYearNumber(yearName: string): number | null {
    const match = yearName.match(/(\d+)/);
    if (!match) {
      return null;
    }

    const value = Number(match[1]);
    return Number.isInteger(value) ? value : null;
  }
}
