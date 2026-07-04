import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { User } from 'generated/prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
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

  @Post()
  async createUser(
    @Param('schoolId', ParseIntPipe) schoolId: number,
    @Body() createUserDto: CreateUserDto,
  ): Promise<User> {
    return this.usersService.createUser(schoolId, createUserDto);
  }
}
