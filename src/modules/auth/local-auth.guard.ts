import {
  BadRequestException,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { validationPipeOptions } from 'src/core/validation/validationPipeOptions';
import { LoginUserDto } from './dto/login.dto';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<{ body: unknown }>();
    const dto = plainToInstance(LoginUserDto, request.body);
    const errors = validateSync(dto, {
      whitelist: validationPipeOptions.whitelist,
      forbidNonWhitelisted: validationPipeOptions.forbidNonWhitelisted,
    });

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    request.body = dto;
    return super.canActivate(context);
  }
}
