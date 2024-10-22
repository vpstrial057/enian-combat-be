import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '@/shared/prisma/prisma.service';
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private prisma: PrismaService) {}

  async register(
    registerDto: RegisterDto,
  ): Promise<{ user: User; telegramAge: number; pointsReceived: number }> {
    const telegramAge = this.calculateTelegramAge(registerDto.telegramId);
    const points = this.calculatePoints(telegramAge);

    try {
      try {
        const user = await this.prisma.user.create({
          data: {
            ...registerDto,
            gold: points,
            createdBy: 'Registration',
            updatedBy: 'Registration',
            tonAddress: registerDto.tonAddress ?? null,
            evmAddress: registerDto.evmAddress ?? null,
          },
        });

        this.logger.log(`User registered successfully: ${user.id}`);

        return {
          user,
          telegramAge,
          pointsReceived: points,
        };
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === 'P2002'
        ) {
          this.logger.error(
            `Unique constraint failed on the field: ${error.meta?.target}`,
          );
          throw new ConflictException(
            `User with this ${error.meta?.target} already exists`,
          );
        }
        throw error;
      }
    } catch (error: any) {
      this.logger.error(`Registration failed: ${error.message}`);
      throw error;
    }
  }

  private calculateTelegramAge(telegramId: string): number {
    // todo : dummy
    return Math.floor(Math.random() * 1000);
  }

  private calculatePoints(telegramAge: number): number {
    // todo : dummy
    return Math.floor(telegramAge / 10);
  }
}
