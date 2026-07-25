import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { RouterModule } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './core/prisma/prisma.module';
import {
  AdditionalActivityAssignmentModule,
  AdditionalActivityModule,
  AssignmentsModule,
  AuthModule,
  CategoriesModule,
  ClassesModule,
  ImportModule,
  ProgramSubjectsModule,
  ProgramYearsModule,
  ProgramsModule,
  SchoolsModule,
  SubjectsModule,
  TeachersModule,
  UsersModule,
  YearsModule,
} from './modules';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    SchoolsModule,
    TeachersModule,
    SubjectsModule,
    AssignmentsModule,
    ProgramsModule,
    ProgramSubjectsModule,
    ProgramYearsModule,
    YearsModule,
    CategoriesModule,
    AdditionalActivityModule,
    AdditionalActivityAssignmentModule,
    ClassesModule,
    ImportModule,
    RouterModule.register([
      {
        path: 'schools',
        module: SchoolsModule,
        children: [
          {
            path: 'users',
            module: UsersModule,
          },
          {
            path: 'teachers',
            module: TeachersModule,
          },
          {
            path: 'programs',
            module: ProgramsModule,
          },
          {
            path: 'subjects',
            module: SubjectsModule,
          },
          {
            path: 'assignments',
            module: AssignmentsModule,
          },
          {
            path: 'subject-to-program',
            module: ProgramSubjectsModule,
          },
          {
            path: 'program-years',
            module: ProgramYearsModule,
          },
          {
            path: 'years',
            module: YearsModule,
          },
          {
            path: 'categories',
            module: CategoriesModule,
          },
          {
            path: 'additional-activities',
            module: AdditionalActivityModule,
          },
          {
            path: 'additional-activity-assignments',
            module: AdditionalActivityAssignmentModule,
          },
          {
            path: 'classes',
            module: ClassesModule,
          },
          {
            path: 'import',
            module: ImportModule,
          },
        ],
      },
    ]),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
