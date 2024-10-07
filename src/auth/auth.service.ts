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
        walletAddress: registerDto.walletAddress ?? '',
        tonWallet: registerDto.tonWallet ?? null,
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

  async login(telegramId: string): Promise<LoginResponseDto> {
    const user = await this.userService.findByTelegramId(telegramId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const payload = { telegramId: user.telegramId, sub: user.id };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = await this.generateRefreshToken(user);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: this.mapToUserResponseDto(user),
    };
  }

  private async generateAccessToken(user: User): Promise<string> {
    const payload = {
      telegramId: user.telegramId,
      sub: user.id,
      jti: uuidv4(),
    };
    return this.jwtService.sign(payload, { expiresIn: '15m' });
  }

  private async generateRefreshToken(user: User): Promise<string> {
    const jti = uuidv4();
    const refreshToken = this.jwtService.sign(
      { sub: user.id, jti },
      { expiresIn: '7d' },
    );

    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        jti,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    return refreshToken;
  }

  async refreshTokens(
    refreshToken: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const storedToken = await this.prisma.refreshToken.findUnique({
        where: { jti: payload.jti },
        include: { user: true },
      });

      if (
        !storedToken ||
        storedToken.userId !== payload.sub ||
        storedToken.token !== refreshToken
      ) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      if (storedToken.expiresAt < new Date()) {
        throw new UnauthorizedException('Refresh token has expired');
      }

      await this.prisma.refreshToken.delete({ where: { id: storedToken.id } });

      const newAccessToken = await this.generateAccessToken(storedToken.user);
      const newRefreshToken = await this.generateRefreshToken(storedToken.user);

      return {
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
      };
    } catch (error: unknown) {
      this.logger.error(`Refresh token error: ${(error as Error).message}`);
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async logout(userId: string): Promise<void> {
    await this.prisma.refreshToken.deleteMany({ where: { userId } });
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
      walletAddress: user.walletAddress,
      telegramId: user.telegramId,
      tonWallet: user.tonWallet,
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
