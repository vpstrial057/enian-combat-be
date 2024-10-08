import { PrismaService } from '@/shared/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { ListMissionQueryDto } from './dto/list-mission-query.dto';
import { PaginatedMissionResponseDto } from './dto/paginated-mission-response.dto';
import { MissionResponseDto } from './dto/mission-response.dto';

@Injectable()
export class MissionService {
  constructor(private prisma: PrismaService) {}

  async list(query: ListMissionQueryDto): Promise<PaginatedMissionResponseDto> {
    const { page = 1, perPage = 10 } = query;
    const skip = (page - 1) * perPage;

    const [missions, total] = await Promise.all([
      this.prisma.mission.findMany({
        where: { type: query.type },
        skip: skip,
        take: perPage,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.mission.count(),
    ]);

    const missionResponseDto: MissionResponseDto[] = missions.map(
      (mission) => ({
        id: mission.id,
        type: mission.type,
        socialTask: mission.socialTask,
        title: mission.title,
        url: mission.url,
        image: mission.image,
        gold: mission.gold,
        cooldown: mission.cooldown,
        createdAt: mission.createdAt,
        updatedAt: mission.updatedAt,
        createdBy: mission.updatedBy,
        updatedBy: mission.updatedBy,
        deletedAt: mission.deletedAt,
      }),
    );

    return {
      missions: missionResponseDto,
      meta: {
        total,
        page,
        perPage,
        totalPages: Math.ceil(total / perPage),
      },
    };
  }
}
