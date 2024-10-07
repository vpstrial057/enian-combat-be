import {
  Controller,
  Get,
  Put,
  Param,
  Body,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiResponse,
  ApiOperation,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { GetUser } from '@/auth/decorators/get-user.decorator';
import { User } from '@prisma/client';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { ListUserQueryDto } from './dto/list-user-query.dto';
import { PaginatedUserResponseDto } from './dto/paginated-user-response.dto';
import { UserResponseDto } from './dto/user-response.dto';

@ApiTags('User')
@Controller('user')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Get paginated list of users' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'perPage', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Return paginated list of users',
    type: PaginatedUserResponseDto,
  })
  async listUsers(
    @Query() query: ListUserQueryDto,
  ): Promise<PaginatedUserResponseDto> {
    return this.userService.listUsers(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({
    status: 200,
    description: 'Return user details',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<UserResponseDto> {
    return this.userService.getUserById(id);
  }

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: 200,
    description: 'Return user profile',
    type: UserResponseDto,
  })
  async getProfile(@GetUser() user: User): Promise<UserResponseDto> {
    return this.userService.getUserProfile(user.id);
  }

  @Put('wallet')
  @ApiOperation({ summary: 'Update user wallet information' })
  @ApiBody({ type: UpdateWalletDto })
  @ApiResponse({
    status: 200,
    description: 'Wallet information updated successfully',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 409, description: 'Wallet address already in use' })
  async updateWallet(
    @GetUser() user: User,
    @Body() updateWalletDto: UpdateWalletDto,
  ): Promise<UserResponseDto> {
    return this.userService.updateUserWallets(user.id, updateWalletDto);
  }
}
