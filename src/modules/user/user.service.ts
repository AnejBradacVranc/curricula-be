import { Injectable, NotFoundException } from '@nestjs/common';
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

  async userById(schoolId: number, userId: number): Promise<User> {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, schoolId },
    });

    if (!user) {
      throw new NotFoundException('User not found for this school');
    }

    return user;
  }

  async userByEmail(schoolId: number, email: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { email, schoolId },
    });

    if (!user) {
      throw new NotFoundException('User not found for this school');
    }

    return user;
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
