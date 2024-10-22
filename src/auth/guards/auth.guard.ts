import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../app/user/user.service';
import { checkTokenExpiry, extractTokenFromHeader } from '../utils/token.utils';
import { Logger } from '@nestjs/common';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name);

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
      this.validatePayload(payload);
      const user = await this.verifyUser(payload);
      request['user'] = user;

      return true;
    } catch (error: any) {
      if (error.name === 'TokenExpiredError') {
        this.logger.error(`Token expired: ${error.message}`);
        throw new UnauthorizedException('Token has expired');
      } else {
        this.logger.error(`JWT Verification failed: ${error.message}`);
        throw new UnauthorizedException('Invalid token');
      }
    }
  }

  private validatePayload(payload: any) {
    if (
      !payload.telegramId ||
      !payload.sub ||
      payload.telegramId !== payload.sub
    ) {
      throw new UnauthorizedException('Invalid token payload');
    }
  }

  private async verifyUser(payload: any) {
    const user = await this.userService.findByTelegramId(payload.telegramId);
    if (!user) {
      this.logger.warn(`User not found: ${payload.telegramId}`);
      throw new UnauthorizedException('User not found or invalid');
    }
    return user;
  }
}
