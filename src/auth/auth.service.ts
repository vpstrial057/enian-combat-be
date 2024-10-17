import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@/app/user/user.service';
import { LoginResponseDto } from './dto/login-response.dto';
import { UserResponseDto } from '@/app/user/dto/user-response.dto';
import { RegisterDto } from './dto/register.dto';
import { User } from '@prisma/client';
import { PrismaService } from '@/shared/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async register(
    registerDto: RegisterDto,
  ): Promise<{ user: User; telegramAge: number; pointsReceived: number }> {
    const telegramAge = this.calculateTelegramAge(registerDto.telegramId);
    const points = this.calculatePoints(telegramAge);

    try {
      const user = await this.userService.create({
        ...registerDto,
        gold: points,
        createdBy: 'Registration',
        updatedBy: 'Registration',
        tonAddress: registerDto.tonAddress ?? null,
        evmAddress: registerDto.evmAddress ?? null,
      });

      this.logger.log(`User registered successfully: ${user.id}`);

      return {
        user,
        telegramAge,
        pointsReceived: points,
      };
    } catch (error: any) {
      this.logger.error(`Registration failed: ${error.message}`);
      throw error;
    }
  }

  async validateUser(telegramId: string): Promise<UserResponseDto> {
    const user = await this.userService.findOrCreateUser(telegramId);
    if (!user) {
      this.logger.warn(`User not found with telegramId: ${telegramId}`);
      throw new UnauthorizedException('User not found');
    }
    this.logger.log(`User validated with telegramId: ${telegramId}`);
    return this.mapToUserResponseDto(user);
  }

  private calculateTelegramAge(telegramId: string): number {
    // todo : dummy
    return Math.floor(Math.random() * 1000);
  }

  private calculatePoints(telegramAge: number): number {
    // todo : dummy
    return Math.floor(telegramAge / 10);
  }

  private mapToUserResponseDto(user: User): UserResponseDto {
    return {
      id: user.id,
      telegramId: user.telegramId,
      tonAddress: user.tonAddress,
      evmAddress: user.evmAddress,
      gold: user.gold,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt,
      createdBy: user.createdBy,
      updatedBy: user.updatedBy,
    };
  }
}
