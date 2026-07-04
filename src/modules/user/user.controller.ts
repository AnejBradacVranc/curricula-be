import { Controller, Get } from '@nestjs/common';
import { UsersService } from './user.service';
import { User } from 'generated/prisma/client';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUsers(): Promise<User[] | null> {
    return this.usersService.getUsers();
  }
}
