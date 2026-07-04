import { Body, Controller, Get, Post } from '@nestjs/common';
import { User } from 'generated/prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './user.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUsers(): Promise<User[] | null> {
    return this.usersService.users();
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.createUser(createUserDto);
  }
}
