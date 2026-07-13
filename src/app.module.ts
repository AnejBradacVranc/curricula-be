import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { RouterModule } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './core/prisma/prisma.module';
import { AssignmentsModule } from './modules/assignment/assignment.module';
import { ProgramSubjectsModule } from './modules/program-subject/program-subject.module';
import { ProgramYearsModule } from './modules/program-year/program-year.module';
import { ProgramsModule } from './modules/program/program.module';
import { YearsModule } from './modules/year/year.module';
import { CategoriesModule } from './modules/category/category.module';
import { AdditionalActivityModule } from './modules/additional-activity/additional-activity.module';
import { AdditionalActivityAssignmentModule } from './modules/additional-activity-assignment/additional-activity-assignment.module';
import { SchoolsModule } from './modules/school/school.module';
import { SubjectsModule } from './modules/subject/subject.module';
import { TeachersModule } from './modules/teacher/teacher.module';
import { UsersModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
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
