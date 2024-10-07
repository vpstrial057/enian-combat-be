import { IsString, IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ description: 'Telegram ID of the user' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  telegramId: string = '';
}
