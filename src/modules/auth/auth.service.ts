import { Injectable } from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { User } from 'generated/prisma/client';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { RegisterUserDto } from './dto/register.dto';

const saltOrRounds = 10;

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async validatPassword(hashedPass: string, pass: string): Promise<boolean> {
    const isMatch = await bcrypt.compare(pass, hashedPass);

    return isMatch;
  }

  async hashPswd(pass: string): Promise<string> {
    const hash = await bcrypt.hash(pass, saltOrRounds);
    return hash;
  }

  async registerUser(data: RegisterUserDto): Promise<User> {
    const { password, schoolId, ...rest } = data;
    const hash = await this.hashPswd(password);

    return this.prisma.user.create({
      data: {
        password: hash,
        ...rest,
        school: { connect: { id: schoolId } },
      },
    });
  }

  async loginUser(user: User) {
    const payload = { email: user.email, sub: user.id, school: user.schoolId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
