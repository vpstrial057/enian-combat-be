import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma/prisma.service';
import { MissionType, User } from '@prisma/client';

@Injectable()
export class OnboardingService {
  constructor(private prisma: PrismaService) {}

  async get(user: User): Promise<boolean> {
    if (user.finishOnboarding) return true;

    const missions = await this.prisma.mission.findMany({
      where: { type: MissionType.ONBOARDING },
    });

    const missionIds = missions.map((mission) => mission.id);

    const completedMissions = await this.prisma.completedMission.findMany({
      where: { userId: user.id },
    });

    const completedMissionIds = completedMissions.map(
      (completed) => completed.missionId,
    );

    const allMissionsCompleted = missionIds.every((id) =>
      completedMissionIds.includes(id),
    );

    if (allMissionsCompleted) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { finishOnboarding: allMissionsCompleted },
      });
    }

    return allMissionsCompleted;
  }
}
