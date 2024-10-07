import {
  PaginatedResult,
  PaginateFunction,
  paginator,
} from '@/commons/paginator.common';
import { PrismaService } from '@/shared/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { ListMissionQueryDto } from './dto/list-mission-query.dto';
import { Mission, Prisma } from '@prisma/client';

const paginate: PaginateFunction = paginator({ perPage: 5 });

@Injectable()
export class MissionService {
  constructor(private prisma: PrismaService) {}

  async list(query: ListMissionQueryDto): Promise<PaginatedResult<Mission[]>> {
    const queryMission: Prisma.MissionFindManyArgs = {
      where: {},
    };

    const missions: PaginatedResult<Mission[]> = await paginate(
      this.prisma.mission,
      queryMission,
      {
        page: query.page,
        perPage: query.perPage,
      },
    );

    return missions;
  }
}
