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
  ExtractModule,
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
import { CDNModule } from './core/cdn/cdn.module';

@Module({
  imports: [
    PrismaModule,
    CDNModule,
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
    ExtractModule,
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
            path: 'extract',
            module: ExtractModule,
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
