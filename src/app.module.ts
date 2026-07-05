import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
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
