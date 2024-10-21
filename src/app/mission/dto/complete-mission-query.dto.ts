import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString } from 'class-validator';

export class CompleteMissionBodyDto {
  @ApiProperty()
  @Type(() => String)
  @IsString()
  missionId!: string;
}
