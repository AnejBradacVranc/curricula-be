import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './core/prisma/prisma.module';
import { AssignmentsModule } from './modules/assignment/assignment.module';
import { ProgramSubjectsModule } from './modules/program-subject/program-subject.module';
import { ProgramsModule } from './modules/program/program.module';
import { SchoolsModule } from './modules/school/school.module';
import { SubjectsModule } from './modules/subject/subject.module';
import { TeachersModule } from './modules/teacher/teacher.module';
import { UsersModule } from './modules/user/user.module';

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
    RouterModule.register([
      {
        path: 'schools',
        module: SchoolsModule,
        children: [
          {
            path: ':schoolId/users',
            module: UsersModule,
          },
          {
            path: ':schoolId/teachers',
            module: TeachersModule,
          },
          {
            path: ':schoolId/programs',
            module: ProgramsModule,
          },
          {
            path: ':schoolId/subjects',
            module: SubjectsModule,
          },
          {
            path: ':schoolId/assignments',
            module: AssignmentsModule,
          },
          {
            path: ':schoolId/subject-to-program',
            module: ProgramSubjectsModule,
          },
        ],
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
