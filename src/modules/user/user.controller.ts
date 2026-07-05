import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { User } from 'generated/prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { FindUserByEmailDto } from './dto/find-user-by-email.dto';
import { UsersService } from './user.service';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUsers(
    @Param('schoolId', ParseIntPipe) schoolId: number,
  ): Promise<User[]> {
    return this.usersService.usersBySchool(schoolId);
  }

  @Get()
  async getUserByEmail(
    @Param('schoolId', ParseIntPipe) schoolId: number,
    @Query() { email }: FindUserByEmailDto,
  ): Promise<User> {
    return this.usersService.userByEmail(schoolId, email);
  }

  @Get(':userId')
  async getUser(
    @Param('schoolId', ParseIntPipe) schoolId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<User> {
    return this.usersService.userById(schoolId, userId);
  }

  @Post()
  async createUser(
    @Param('schoolId', ParseIntPipe) schoolId: number,
    @Body() createUserDto: CreateUserDto,
  ): Promise<User> {
    return this.usersService.createUser(schoolId, createUserDto);
  }
}
