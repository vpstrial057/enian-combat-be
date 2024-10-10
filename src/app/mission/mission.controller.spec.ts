import { MissionController } from './mission.controller';
import { MissionService } from './mission.service';
import { ListMissionQueryDto } from './dto/list-mission-query.dto';
import { PaginatedMissionResponseDto } from './dto/paginated-mission-response.dto';
import { UserController } from '../user/user.controller';
import { UserService } from '../user/user.service';
import { UserResponseDto } from '../user/dto/user-response.dto';

describe('MissionController', () => {
  let controller: MissionController;
  let userController: UserController;
  let missionService: jest.Mocked<MissionService>;
  let userService: jest.Mocked<UserService>;

  beforeEach(() => {
    missionService = {
      list: jest.fn(),
    } as unknown as jest.Mocked<MissionService>;
    userService = {
      getUserById: jest.fn(),
    } as unknown as jest.Mocked<UserService>;

    controller = new MissionController(missionService);
    userController = new UserController(userService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(userController).toBeDefined();
  });

  describe('Get missions', () => {
    it('should call missionService.list with the provided query', async () => {
      const query: ListMissionQueryDto = {
        page: 1,
        perPage: 10,
      };
      const mockPaginatedResponse: PaginatedMissionResponseDto = {
        missions: [],
        meta: { total: 0, page: 1, perPage: 10, totalPages: 1 },
      };
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

      missionService.list.mockResolvedValue(mockPaginatedResponse);
      userService.getUserById.mockResolvedValue(mockUser);

      const user = await userController.getUserById(
        '3136aa1a-fec8-11de-a55f-00003925d394',
      );
      const result = await controller.missions(user, query);

      expect(missionService.list).toHaveBeenCalledWith(user, query);
      expect(result).toEqual(mockPaginatedResponse);
    });
  });
});
