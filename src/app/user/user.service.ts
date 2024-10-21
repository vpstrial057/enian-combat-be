import {
  Injectable,
  ConflictException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '@/shared/prisma/prisma.service';
import { User, Prisma } from '@prisma/client';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { ListUserQueryDto } from './dto/list-user-query.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { PaginatedUserResponseDto } from './dto/paginated-user-response.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput): Promise<User> {
    try {
      return await this.prisma.user.create({ data });
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
  }

  async findByTelegramId(telegramId: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { telegramId } });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async getUserProfile(userId: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      this.logger.warn(`User profile not found for id: ${userId}`);
      throw new NotFoundException('User not found');
    }
    return this.mapToUserResponseDto(user);
  }

  async findOrCreateUser(telegramId: string): Promise<User> {
    let user = await this.prisma.user.findUnique({
      where: { telegramId },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          telegramId,
          tonAddress: `0x${telegramId}`, // Placeholder wallet address
        },
      });
    }

    return user;
  }

  async updateUserWallets(
    userId: string,
    updateWalletDto: UpdateWalletDto,
  ): Promise<User> {
    const { tonAddress: tonAddress, evmAddress } = updateWalletDto;

    if (tonAddress) {
      const existingTonUser = await this.prisma.user.findFirst({
        where: { tonAddress },
      });
      if (existingTonUser && existingTonUser.id !== userId) {
        throw new ConflictException(
          'TON wallet is already associated with another user',
        );
      }
    }

    if (evmAddress) {
      const existingEvmUser = await this.prisma.user.findFirst({
        where: { evmAddress },
      });
      if (existingEvmUser && existingEvmUser.id !== userId) {
        throw new ConflictException(
          'EVM address is already associated with another user',
        );
      }
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: { tonAddress, evmAddress },
    });
  }

  async listUsers(query: ListUserQueryDto): Promise<PaginatedUserResponseDto> {
    const { page = 1, perPage = 10 } = query;
    const skip = (page - 1) * perPage;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: perPage,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count(),
    ]);

    const userResponseDtos: UserResponseDto[] = users.map((user) => ({
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
    }));

    return {
      users: userResponseDtos,
      meta: {
        total,
        page,
        perPage,
        totalPages: Math.ceil(total / perPage),
      },
    };
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
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
