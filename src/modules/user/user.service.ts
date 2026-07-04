import { Injectable } from '@nestjs/common';
import { User } from 'generated/prisma/client';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async usersBySchool(schoolId: number): Promise<User[]> {
    return this.prisma.user.findMany({
      where: { schoolId },
    });
  }

  async createUser(schoolId: number, data: CreateUserDto): Promise<User> {
    return this.prisma.user.create({
      data: {
        ...data,
        school: { connect: { id: schoolId } },
      },
    });
  }
}
