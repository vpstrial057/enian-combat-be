import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ListUserQueryDto } from './dto/list-user-query.dto';
import { PaginatedUserResponseDto } from './dto/paginated-user-response.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';

describe('UserController', () => {
  let controller: UserController;
  let userService: jest.Mocked<UserService>;

  beforeEach(() => {
    userService = {
      listUsers: jest.fn(),
      getUserById: jest.fn(),
      getUserProfile: jest.fn(),
      updateUserWallets: jest.fn(),
    } as unknown as jest.Mocked<UserService>;

    controller = new UserController(userService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('listUsers', () => {
    it('should call userService.listUsers with the provided query', async () => {
      const query: ListUserQueryDto = { page: 1, perPage: 10 };
      const mockPaginatedResponse: PaginatedUserResponseDto = {
        users: [],
        meta: { total: 0, page: 1, perPage: 10, totalPages: 0 },
      };

      userService.listUsers.mockResolvedValue(mockPaginatedResponse);

      const result = await controller.listUsers(query);

      expect(userService.listUsers).toHaveBeenCalledWith(query);
      expect(result).toEqual(mockPaginatedResponse);
    });
  });

  describe('getUserById', () => {
    it('should call userService.getUserById with the provided id', async () => {
      const userId = 'test-uuid';
      const mockUser: UserResponseDto = {
        id: 'test-uuid',
        walletAddress: 'test-wallet-address',
        telegramId: 'test-telegram-id',
        tonWallet: 'test-ton-wallet',
        evmAddress: 'test-evm-address',
        gold: 100,
        createdBy: 'test-creator',
        updatedBy: 'test-updater',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      userService.getUserById.mockResolvedValue(mockUser);

      const result = await controller.getUserById(userId);

      expect(userService.getUserById).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockUser);
    });
  });

  describe('getProfile', () => {
    it('should call userService.getUserProfile with the user id', async () => {
      const mockUser: any = { id: 'test-user-id' };
      const mockUserProfile: UserResponseDto = {
        id: 'test-user-id',
        walletAddress: 'test-wallet-address',
        telegramId: 'test-telegram-id',
        tonWallet: 'test-ton-wallet',
        evmAddress: 'test-evm-address',
        gold: 100,
        createdBy: 'test-creator',
        updatedBy: 'test-updater',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      userService.getUserProfile.mockResolvedValue(mockUserProfile);

      const result = await controller.getProfile(mockUser);

      expect(userService.getUserProfile).toHaveBeenCalledWith(mockUser.id);
      expect(result).toEqual(mockUserProfile);
    });
  });

  describe('updateWallet', () => {
    it('should call userService.updateUserWallets with the provided user and dto', async () => {
      const mockUser: any = {
        id: 'test-uuid',
        walletAddress: 'old-wallet-address',
        telegramId: 'test-telegram-id',
        tonWallet: 'old-ton-wallet',
        evmAddress: 'old-evm-address',
        gold: 100,
        createdBy: 'test-creator',
        updatedBy: 'test-updater',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };
      const updateWalletDto: UpdateWalletDto = {
        tonAddress: 'new-ton-wallet',
        evmAddress: 'new-evm-address',
      };
      const updatedUser: UserResponseDto = { ...mockUser, ...updateWalletDto };

      userService.updateUserWallets.mockResolvedValue(updatedUser);

      const result = await controller.updateWallet(mockUser, updateWalletDto);

      expect(userService.updateUserWallets).toHaveBeenCalledWith(
        mockUser.id,
        updateWalletDto,
      );
      expect(result).toEqual(updatedUser);
    });
  });
});
