import { BadRequestException, Injectable } from '@nestjs/common';
import { AiService } from 'src/core/ai/ai.service';
import { ExtractPromptKind } from 'src/core/ai/prompts/prompt.factory';
import {
  extractTeachersSchema,
  type ExtractTeacherSchema,
} from '../teacher/dto/create-teacher.schema';

@Injectable()
export class ExtractService {
  constructor(private readonly aiService: AiService) {}

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

    return this.toTeachers(result.teachers);
  }

  async extractProgram(_file: Express.Multer.File): Promise<void> {}

  async extractSubjects(_file: Express.Multer.File): Promise<void> {}

  private toTeachers(
    teachers: ExtractTeacherSchema[],
  ): ExtractTeacherSchema[] {
    return teachers.map((teacher) => ({
      name: teacher.name.trim(),
      surname: teacher.surname.trim(),
      email: teacher.email.trim().toLowerCase(),
    }));
  }
}
