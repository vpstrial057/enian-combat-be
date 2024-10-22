import { Module } from '@nestjs/common';
import { OnboardingService } from './onboarding.service';
import { OnboardingController } from './onboarding.controller';
import { UserService } from '../user/user.service';

@Module({
  controllers: [OnboardingController],
  providers: [OnboardingService, UserService],
})
export class OnboardingModule {}
