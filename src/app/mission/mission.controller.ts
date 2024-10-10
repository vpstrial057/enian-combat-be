import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
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
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { GetUser } from '@/auth/decorators/get-user.decorator';
import { User } from '@prisma/client';
import { PaginatedMissionResponseDto } from './dto/paginated-mission-response.dto';

@ApiTags('Mission')
@Controller('missions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
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
    return await this.missionService.list(user.id, query);
  }
}
