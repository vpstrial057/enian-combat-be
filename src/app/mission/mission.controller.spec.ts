import { MissionController } from './mission.controller';
import { MissionService } from './mission.service';
import { ListMissionQueryDto } from './dto/list-mission-query.dto';
import { PaginatedMissionResponseDto } from './dto/paginated-mission-response.dto';
import { UserController } from '../user/user.controller';
import { UserService } from '../user/user.service';
import { User } from '@prisma/client';

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
      const mockUser: User = {
        id: '3136aa1a-fec8-11de-a55f-00003925d394',
        telegramId: 'test-telegram-id',
        tonAddress: 'test-ton-wallet',
        evmAddress: 'test-evm-address',
        gold: 100,
        createdBy: 'Seeder',
        updatedBy: 'Seeder',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        gem: 0,
        finishOnboarding: false,
      };

      missionService.list.mockResolvedValue(mockPaginatedResponse);
      userService.getUserById.mockResolvedValue(mockUser);

      const user = await userService.getUserById(
        '3136aa1a-fec8-11de-a55f-00003925d394',
      );
      const result = await controller.missions(user, query);

      expect(userService.getUserById).toHaveBeenCalledWith(
        '3136aa1a-fec8-11de-a55f-00003925d394',
      );
      expect(user).toEqual(mockUser);
      expect(missionService.list).toHaveBeenCalledWith(user.id, query);
      expect(result).toEqual(mockPaginatedResponse);
    });
  });
});
