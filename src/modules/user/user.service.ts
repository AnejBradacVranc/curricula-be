import { Injectable } from '@nestjs/common';
import { User } from 'generated/prisma/client';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async users(): Promise<User[] | null> {
    return this.prisma.user.findMany();
  }

  async createUser(data: CreateUserDto): Promise<User> {
    const { schoolId, ...rest } = data;
    return this.prisma.user.create({
      data: {
        ...rest,
        school: { connect: { id: schoolId } },
      },
    });
  }
}
