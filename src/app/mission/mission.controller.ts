import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { MissionService } from './mission.service';
import { ListMissionQueryDto } from './dto/list-mission-query.dto';
import { JwtAuthGuard } from '@/auth/guards/auth.guard';
import { GetUser } from '@/auth/decorators/get-user.decorator';
import { User } from '@prisma/client';
import { PaginatedMissionResponseDto } from './dto/paginated-mission-response.dto';
import { CompleteMissionBodyDto } from './dto/complete-mission-query.dto';

@ApiTags('Mission')
@Controller('missions')
// @UseGuards(JwtAuthGuard)
// @ApiBearerAuth()
export class MissionController {
  constructor(private readonly missionService: MissionService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get missions list' })
  @ApiResponse({
    status: 200,
    description: 'Missions retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Unable to retrieve missions list' })
  async missions(
    @GetUser() user: User,
    @Query() query: ListMissionQueryDto,
  ): Promise<PaginatedMissionResponseDto> {
    return await this.missionService.list(
      '3136aa1a-fec8-11de-a55f-00003925d394',
      query,
    );
  }

  @Post('/complete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Complete the mission' })
  @ApiResponse({
    status: 200,
    description: 'Mission completed successfully',
  })
  @ApiResponse({ status: 400, description: 'Mission incomplete' })
  async complete(
    @GetUser() user: User,
    @Body() body: CompleteMissionBodyDto,
  ): Promise<void> {
    return await this.missionService.complete(
      '3136aa1a-fec8-11de-a55f-00003925d394',
      body.missionId,
    );
  }
}
