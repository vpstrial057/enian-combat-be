import { IsString, IsOptional, Length, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Telegram ID is required' })
  @Length(1, 255)
  telegramId!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Length(1, 255, {
    message: 'Wallet address must be exactly max 255 characters long',
  })
  walletAddress?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Length(1, 255)
  tonWallet?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Length(1, 255)
  evmAddress?: string;
}
