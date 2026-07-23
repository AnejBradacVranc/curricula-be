import { BadRequestException, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { AiService } from 'src/core/ai/ai.service';
import { ImportPromptKind } from 'src/core/ai/prompts/prompt.factory';
import { CreateTeacherDto } from '../teacher/dto/create-teacher.dto';
import {
  importTeachersSchema,
  type CreateTeacherSchema,
} from '../teacher/dto/create-teacher.schema';

@Injectable()
export class ImportService {
  constructor(private readonly aiService: AiService) {}

  async importTeachers(file: Express.Multer.File): Promise<CreateTeacherDto[]> {
    const { system, user } = this.aiService.promptFactory.getPrompts(
      ImportPromptKind.Teachers,
    );

    const result = await this.aiService.generateResponse(
      user,
      importTeachersSchema,
      system,
      file,
    );

    if (!result?.teachers?.length) {
      throw new BadRequestException(
        'Iz dokumenta ni bilo mogoče razbrati učiteljev.',
      );
    }

    return this.toValidatedTeachers(result.teachers);
  }

  async importProgram(_file: Express.Multer.File): Promise<void> {}

  async importSubjects(_file: Express.Multer.File): Promise<void> {}

  private async toValidatedTeachers(
    teachers: CreateTeacherSchema[],
  ): Promise<CreateTeacherDto[]> {
    const dtos = plainToInstance(
      CreateTeacherDto,
      teachers.map((teacher) => ({
        ...teacher,
        color: teacher.color ?? undefined,
      })),
    );

    const validated: CreateTeacherDto[] = [];

    for (const dto of dtos) {
      const errors = await validate(dto);
      if (errors.length > 0) {
        throw new BadRequestException(
          'AI je vrnil neveljavne podatke o učiteljih.',
        );
      }
      validated.push(dto);
    }

    return validated;
  }
}
