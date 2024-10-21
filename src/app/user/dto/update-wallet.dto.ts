import { IsString, IsOptional, Length } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateWalletDto {
  @ApiPropertyOptional({ description: 'TON wallet address' })
  @IsOptional()
  @IsString()
  @Length(1, 255)
  tonAddress?: string;

  @ApiPropertyOptional({ description: 'EVM address' })
  @IsOptional()
  @IsString()
  @Length(1, 255)
  evmAddress?: string;
}
