import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserResponseDto } from './dto/user-response.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { User } from '@prisma/client';
import { WalletType } from '@/constants/wallet.constants';

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

  describe('getProfile', () => {
    it('should call userService.getUserProfile with the user id', async () => {
      const mockUser: any = { id: 'test-user-id' };
      const mockUserProfile: UserResponseDto = {
        id: 'test-user-id',
        telegramId: 'test-telegram-id',
        tonAddress: 'test-ton-wallet',
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
        telegramId: 'test-telegram-id',
        tonWallet: 'old-ton-wallet',
        evmAddress: 'old-evm-address',
        gold: 100,
        gem: 0,
        finishOnboarding: false,
        createdBy: 'test-creator',
        updatedBy: 'test-updater',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };
      const updateWalletDto: UpdateWalletDto = {
        type: WalletType.EVM,
        walletAddress: 'new-evm-address',
      };
      const updatedUser: User = { ...mockUser, ...updateWalletDto };

      userService.updateUserWallets.mockResolvedValue({
        ...mockUser,
        ...updateWalletDto,
      });

      const result = await controller.updateWallet(mockUser, updateWalletDto);

      expect(userService.updateUserWallets).toHaveBeenCalledWith(
        mockUser.id,
        updateWalletDto,
      );
      expect(result).toEqual(updatedUser);
    });
  });
});
