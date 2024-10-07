import { ApiProperty } from '@nestjs/swagger';
import { MissionResponseDto } from './mission-response.dto';

export class PaginatedMissionResponseDto {
  @ApiProperty({ type: [MissionResponseDto] })
  missions: MissionResponseDto[] = [];

  @ApiProperty()
  meta: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
  } = {
    total: 0,
    page: 1,
    perPage: 10,
    totalPages: 0,
  };
}
