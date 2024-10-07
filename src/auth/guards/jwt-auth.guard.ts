import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  Scope,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../app/user/user.service';
import { Reflector } from '@nestjs/core';
import { checkTokenExpiry, extractTokenFromHeader } from '../utils/token.utils';
import { Logger } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private reflector: Reflector,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = extractTokenFromHeader(request.headers);

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      // console.log(`Payload IAT: ${payload.iat}`);
      checkTokenExpiry(payload.iat);
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
    if (!payload.telegramId || !payload.sub) {
      throw new UnauthorizedException('Invalid token payload');
    }
  }

  private async verifyUser(payload: any) {
    this.logger.log(`Validating JWT token for user ${payload.sub}`);
    const user = await this.userService.findById(payload.sub);
    if (!user || user.id !== payload.sub) {
      this.logger.warn(`User not found: ${payload.sub}`);
      throw new UnauthorizedException('User not found or invalid');
    }
    return user;
  }
}
