import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MissionService } from './mission.service';
import { ListMissionQueryDto } from './dto/list-mission-query.dto';

@ApiTags('Mission')
@Controller('missions')
export class MissionController {
  constructor(private missionService: MissionService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get missions list' })
  @ApiResponse({
    status: 200,
    description: 'Missions retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Unable to retrieve missions list' })
  async missions(@Query() query: ListMissionQueryDto) {
    return await this.missionService.list(query);
  }
}
