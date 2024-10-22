import { WalletType } from '@/constants/wallet.constants';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEnum, IsString, Length } from 'class-validator';

export class UpdateWalletDto {
  @ApiProperty({ description: 'Address Type' })
  @IsNotEmpty()
  @IsEnum(WalletType)
  type!: string;

  @ApiProperty({ description: 'Wallet Address' })
  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  walletAddress!: string;
}
