import { Module } from '@nestjs/common';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService], //Here put Services that will be injected in that specific controller
})
export class UsersModule {}
