import { ApiPropertyOptional } from '@nestjs/swagger';
import { MissionType } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class ListMissionQueryDto {
  @ApiPropertyOptional({ enum: MissionType })
  @IsOptional()
  type?: MissionType;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  perPage?: number;
}
