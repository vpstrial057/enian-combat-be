import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from '@/app/user/dto/user-response.dto';

export class LoginResponseDto {
  @ApiProperty()
  access_token: string = '';

  @ApiProperty()
  refresh_token: string = '';

  @ApiProperty({ type: UserResponseDto })
  user: UserResponseDto = new UserResponseDto();
}
