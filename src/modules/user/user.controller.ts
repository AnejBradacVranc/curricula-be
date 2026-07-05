import { Controller, Get, Query, Request } from '@nestjs/common';
import { User } from 'generated/prisma/client';
import { FindUserByEmailDto } from './dto/find-user-by-email.dto';
import { UsersService } from './user.service';
import { AuthenticatedUser } from '../auth/jwt.strategy';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUsers(
    @Request() req: { user: AuthenticatedUser },
  ): Promise<User[]> {
    return this.usersService.usersBySchool(req.user.schoolId);
  }

  @Get('by-email')
  async getUserByEmail(@Query() { email }: FindUserByEmailDto): Promise<User> {
    return this.usersService.userByEmail(email);
  }
}
