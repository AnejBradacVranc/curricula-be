import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { User } from 'generated/prisma/client';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { RegisterUserDto } from './dto/register.dto';
import { createHash } from 'crypto';

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
    const { password, inviteToken, email, ...rest } = data;

    const inviteTokenHash = createHash('sha256')
      .update(Buffer.from(inviteToken, 'hex'))
      .digest('hex');

    const pswdHash = await this.hashPswd(password);

    const user = await this.prisma.$transaction(async (tx) => {
      const invite = await tx.invite.findUnique({
        where: { token: inviteTokenHash },
      });

      if (!invite) {
        throw new NotFoundException('Invalid invite token');
      }

      if (invite.usedAt) {
        throw new UnauthorizedException('Invite has already been used');
      }

      if (invite.email !== email) {
        throw new UnauthorizedException(
          'Invite does not belong to given email',
        );
      }

      if (Date.now() > invite.expiry.getTime()) {
        throw new UnauthorizedException('Invite token expired');
      }

      const affected = await tx.invite.updateMany({
        where: { id: invite.id, usedAt: null },
        data: { usedAt: new Date() },
      });

      if (affected.count !== 1) {
        throw new UnauthorizedException('Invite has already been used');
      }

      return tx.user.create({
        data: {
          password: pswdHash,
          email,
          role: invite.role,
          ...rest,
          school: { connect: { id: invite.schoolId } },
        },
      });
    });

    const { password: _, ...safeUser } = user;
    return safeUser;
  }

  loginUser(user: UserNoPassword) {
    const payload = { email: user.email, sub: user.id, school: user.schoolId };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
