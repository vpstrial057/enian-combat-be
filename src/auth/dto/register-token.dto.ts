import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class RegisterTokenDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Telegram ID is required' })
  @Length(1, 255)
  telegramId!: string;
}
