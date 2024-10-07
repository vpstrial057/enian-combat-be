import { Test, TestingModule } from '@nestjs/testing';
import { MissionService } from './mission.service';
import { PrismaService } from '@/shared/prisma/prisma.service';

jest.mock('@/commons/paginator.common', () => ({
  paginator: jest.fn().mockReturnValue(() => ({
    data: [],
    meta: {
      total: 0,
      lastPage: 1,
      currentPage: 1,
      perPage: 10,
      prev: null,
      next: null,
    },
  })),
}));

describe('MissionService', () => {
  let service: MissionService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MissionService,
        {
          provide: PrismaService,
          useValue: {
            mission: {
              findMany: jest.fn(),
              count: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<MissionService>(MissionService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
