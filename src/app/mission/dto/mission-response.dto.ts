import { ApiProperty } from '@nestjs/swagger';

export class MissionResponseDto {
  @ApiProperty()
  id: string = '';

  @ApiProperty()
  type: string = 'ONE_TIME';

  @ApiProperty()
  socialTask: string = 'NORMAL';

  @ApiProperty()
  title: string = '';

  @ApiProperty()
  url: string | null = null;

  @ApiProperty()
  image: string | null = null;

  @ApiProperty()
  gold: number = 0;

  @ApiProperty()
  cooldown: number = 0;

  @ApiProperty()
  createdAt: Date = new Date();

  @ApiProperty()
  createdBy: string | null = null;

  @ApiProperty()
  updatedAt: Date = new Date();

  @ApiProperty()
  updatedBy: string | null = null;

  @ApiProperty({ nullable: true })
  deletedAt: Date | null = null;
}
