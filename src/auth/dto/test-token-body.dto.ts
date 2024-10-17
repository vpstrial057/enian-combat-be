import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class TestTokenBodyDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Telegram ID is required' })
  @Length(1, 255)
  telegramId!: string;
}
