import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { OnboardingService } from './onboarding.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetUser } from '@/auth/decorators/get-user.decorator';
import { User } from '@prisma/client';

@ApiTags('Onboarding')
@Controller('onboarding')
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get onboarding status' })
  @ApiResponse({
    status: 200,
    description: 'Onboarding status retrieved successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Unable to retrieve onboarding status',
  })
  async get(@GetUser() user: User): Promise<boolean> {
    return await this.onboardingService.get(
      '3136aa1a-fec8-11de-a55f-00003925d394',
    );
  }
}
