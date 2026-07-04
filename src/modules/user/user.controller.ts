import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './user.service';
import { Prisma, User } from 'generated/prisma/client';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async users(): Promise<User[] | null> {
    return this.usersService.users();
  }

  @Post()
  async createUser(
    @Body() createUserDto: Prisma.UserCreateInput,
  ): Promise<User> {
    return this.usersService.createUser(createUserDto);
  }
}
