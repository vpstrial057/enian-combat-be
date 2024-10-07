import { Test, TestingModule } from '@nestjs/testing';
import { MissionController } from './mission.controller';
import { MissionService } from './mission.service';

describe('MissionController', () => {
  let controller: MissionController;
  let missionService: MissionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MissionController],
      providers: [
        {
          provide: MissionService,
          useValue: {
            list: jest.fn().mockResolvedValue({
              data: [],
              meta: {
                total: 0,
                lastPage: 1,
                currentPage: 1,
                perPage: 10,
                prev: null,
                next: null,
              },
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<MissionController>(MissionController);
    missionService = module.get<MissionService>(MissionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call missionService.list when available is called', async () => {
    const query = { page: 1, perPage: 10 };
    await controller.missions(query);
    expect(missionService.list).toHaveBeenCalledWith(query);
  });
});
