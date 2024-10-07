import { Module } from '@nestjs/common';
import { MissionService } from './mission.service';
import { MissionController } from './mission.controller';
import { UserService } from '../user/user.service';

@Module({
  controllers: [MissionController],
  providers: [UserService, MissionService],
  exports: [MissionService],
})
export class MissionModule {}
