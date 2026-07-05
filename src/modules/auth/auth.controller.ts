import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login.dto';
import { UsersService } from '../user/user.service';
import { RegisterUserDto } from './dto/register.dto';
import { User } from 'generated/prisma/client';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    const { email, pass } = loginUserDto;

    const user = await this.usersService.userByEmail(email);

    const isValid = await this.authService.validatPassword(user.password, pass);

    if (isValid) {
      return await this.authService.loginUser(user);
    }

    throw new UnauthorizedException('Invalid user credentials');
  }

  @Post()
  async register(@Body() createUserDto: RegisterUserDto): Promise<User> {
    return this.authService.registerUser(createUserDto);
  }
}
