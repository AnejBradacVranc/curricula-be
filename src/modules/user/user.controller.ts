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
  async getUserByEmail(@Query() { email }: FindUserByEmailDto): Promise<User> {
    return this.usersService.userByEmail(email);
  }
}
