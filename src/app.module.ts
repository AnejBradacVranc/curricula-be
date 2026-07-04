import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AssignmentsModule } from './modules/assignment/assignment.module';
import { ProgramSubjectsModule } from './modules/program-subject/program-subject.module';
import { ProgramsModule } from './modules/program/program.module';
import { SchoolsModule } from './modules/school/school.module';
import { SubjectsModule } from './modules/subject/subject.module';
import { TeachersModule } from './modules/teacher/teacher.module';
import { UsersModule } from './modules/user/user.module';
import { PrismaModule } from './core/prisma/prisma.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
