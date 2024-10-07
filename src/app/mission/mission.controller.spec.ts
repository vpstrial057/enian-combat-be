import { MissionController } from './mission.controller';
import { MissionService } from './mission.service';
import { ListMissionQueryDto } from './dto/list-mission-query.dto';
import { PaginatedMissionResponseDto } from './dto/paginated-mission-response.dto';

describe('MissionController', () => {
  let controller: MissionController;
  let missionService: jest.Mocked<MissionService>;

  beforeEach(() => {
    missionService = {
      list: jest.fn(),
    } as unknown as jest.Mocked<MissionService>;

    controller = new MissionController(missionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Get mission', () => {
    it('should call missionService.list with the provided query', async () => {
      const query: ListMissionQueryDto = {
        type: 'ONBOARDING',
        page: 1,
        perPage: 10,
      };
      const mockPaginatedResponse: PaginatedMissionResponseDto = {
        missions: [],
        meta: { total: 0, page: 1, perPage: 10, totalPages: 1 },
      };

      missionService.list.mockResolvedValue(mockPaginatedResponse);

      const result = await controller.missions(query);

      expect(missionService.list).toHaveBeenCalledWith(query);
      expect(result).toEqual(mockPaginatedResponse);
    });
  });
});
