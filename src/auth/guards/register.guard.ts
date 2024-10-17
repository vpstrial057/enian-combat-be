import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@/app/user/user.service';
import { checkTokenExpiry, extractTokenFromHeader } from '../utils/token.utils';

@Injectable()
export class RegisterGuard implements CanActivate {
  private readonly logger = new Logger(RegisterGuard.name);

  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = extractTokenFromHeader(request.headers);
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      checkTokenExpiry(payload);

      if (!payload.telegramId) {
        throw new UnauthorizedException(
          'Token payload must contain telegramId',
        );
      }

      this.logger.log(
        `Registering user with telegramId: ${payload.telegramId}`,
      );
      const existingUser = await this.userService.findByTelegramId(
        payload.telegramId,
      );
      if (existingUser) {
        this.logger.warn(
          `User already registered with telegramId: ${payload.telegramId}`,
        );
        throw new UnauthorizedException('User is already registered');
      }

      request['user'] = payload;
      return true;
    } catch (error: any) {
      throw error;
    }
  }
}
