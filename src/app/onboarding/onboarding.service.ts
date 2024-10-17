import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma/prisma.service';
import { MissionType } from '@prisma/client';

@Injectable()
export class OnboardingService {
  constructor(private prisma: PrismaService) {}

  async get(userId: string): Promise<boolean> {
    const missions = await this.prisma.mission.findMany({
      where: { type: MissionType.ONBOARDING },
    });

    const missionIds = missions.map((mission) => mission.id);

    const completedMissions = await this.prisma.completedMission.findMany({
      where: { userId },
    });

    const completedMissionIds = completedMissions.map(
      (completed) => completed.missionId,
    );

    const allMissionsCompleted = missionIds.every((id) =>
      completedMissionIds.includes(id),
    );

    return allMissionsCompleted;
  }
}
