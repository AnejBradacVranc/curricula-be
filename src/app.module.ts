import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './user/user.module';

@Module({
  imports: [PrismaModule, UsersModule], //Here put all other modules for app to use
  controllers: [AppController],
  providers: [AppService], //Here put Services that will be injected in that specific controller
})
export class AppModule {}
