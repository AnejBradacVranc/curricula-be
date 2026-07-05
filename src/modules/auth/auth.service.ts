import { Injectable } from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { User } from 'generated/prisma/client';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { RegisterUserDto } from './dto/register.dto';

const saltOrRounds = 10;

export type UserNoPassword = Omit<User, 'password'>;

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async isPasswordValid(hashedPass: string, pass: string): Promise<boolean> {
    return bcrypt.compare(pass, hashedPass);
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserNoPassword | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user || !(await this.isPasswordValid(user.password, password))) {
      return null;
    }

    const { password: _, ...safeUser } = user;
    return safeUser;
  }

  async hashPswd(pass: string): Promise<string> {
    return bcrypt.hash(pass, saltOrRounds);
  }

  async registerUser(data: RegisterUserDto): Promise<UserNoPassword> {
    const { password, schoolId, ...rest } = data;
    const hash = await this.hashPswd(password);

    const user = await this.prisma.user.create({
      data: {
        password: hash,
        ...rest,
        school: { connect: { id: schoolId } },
      },
    });

    const { password: _, ...safeUser } = user;
    return safeUser;
  }

  loginUser(user: UserNoPassword) {
    const payload = { email: user.email, sub: user.id, school: user.schoolId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
