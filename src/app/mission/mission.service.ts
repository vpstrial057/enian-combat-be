import { PrismaService } from '@/shared/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { ListMissionQueryDto } from './dto/list-mission-query.dto';
import { PaginatedMissionResponseDto } from './dto/paginated-mission-response.dto';
import { MissionResponseDto } from './dto/mission-response.dto';
import { MissionType, SocialTask } from '@prisma/client';

@Injectable()
export class MissionService {
  constructor(private prisma: PrismaService) {}

  async list(
    userId: string,
    query: ListMissionQueryDto,
  ): Promise<PaginatedMissionResponseDto> {
    const { page = 1, perPage = 10 } = query;
    const skip = (page - 1) * perPage;

    const [missions, completedMissions, total] = await Promise.all([
      this.prisma.mission.findMany({
        where: { type: query.type },
        skip: skip,
        take: perPage,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.completedMission.findMany({
        where: { userId: userId },
        skip: skip,
        take: perPage,
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
        isComplete: false,
        createdAt: mission.createdAt,
        updatedAt: mission.updatedAt,
        createdBy: mission.updatedBy,
        updatedBy: mission.updatedBy,
        lastCompletedAt: null,
        deletedAt: mission.deletedAt,
      }),
    );

    missionResponseDto.forEach((mission) => {
      completedMissions.forEach((completedMission) => {
        if (mission.id == completedMission.missionId) {
          mission.isComplete = true;
          mission.lastCompletedAt = completedMission.createdAt;
        }
      });
    });

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

  async complete(userId: string, missionId: string): Promise<void> {
    const mission = await this.prisma.mission.findFirst({
      where: { id: missionId },
    });

    const completedMission = await this.prisma.completedMission.findFirst({
      where: { userId: userId, missionId: missionId },
    });

    if (mission?.type == MissionType.ONE_TIME && completedMission) {
      throw new Error('Mission already completed.');
    }

    const timeDiff: number =
      Date.now() -
      Date.parse(
        completedMission?.createdAt.toISOString() ?? Date.now().toString(),
      );

    if (timeDiff / (1000 * 60 * 60) <= 8) {
      throw new Error('Mission is still in cooldown');
    }

    if (mission?.socialTask == SocialTask.REQUIRED) {
      const isVerified = await this.verify(userId, missionId);
      if (isVerified) {
        await this.prisma.completedMission.create({
          data: {
            missionId: missionId,
            userId: userId,
            gold: mission.gold,
            createdBy: userId,
          },
        });
        return;
      }
    }

    await this.prisma.completedMission.create({
      data: {
        missionId: missionId,
        userId: userId,
        gold: mission?.gold ?? 0,
        createdBy: userId,
      },
    });
  }

  async verify(userId: string, missionId: string): Promise<boolean> {
    const mission = await this.prisma.mission.findFirst({
      where: { id: missionId },
    });

    return true;
  }
}
