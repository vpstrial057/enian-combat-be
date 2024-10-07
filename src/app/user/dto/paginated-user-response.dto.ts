import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from '@/app/user/dto/user-response.dto';

export class PaginatedUserResponseDto {
  @ApiProperty({ type: [UserResponseDto] })
  users: UserResponseDto[] = [];

  @ApiProperty()
  meta: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
  } = {
    total: 0,
    page: 1,
    perPage: 10,
    totalPages: 0,
  };
}
