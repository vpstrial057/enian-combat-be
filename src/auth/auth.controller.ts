import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { RegisterGuard } from './guards/register.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RegisterDto } from './dto/register.dto';
import { UserResponseDto } from '@/app/user/dto/user-response.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { GetUser } from './decorators/get-user.decorator';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { RegisterTokenDto } from './dto/register-token.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @Post('get-registration-token')
  @ApiOperation({ summary: 'Get registration token for testing' })
  @ApiResponse({
    status: 200,
    description: 'Registration token generated successfully',
  })
  async getRegistrationToken(
    @Body() registerTokenDto: RegisterTokenDto,
  ): Promise<{ registration_token: string }> {
    const payload = {
      telegramId: registerTokenDto.telegramId,
      iat: Math.floor(Date.now() / 1000),
    };

    const token = this.jwtService.sign(payload, {
      expiresIn: '5m',
      secret: process.env.JWT_SECRET,
    });

    return { registration_token: token };
  }

  @Post('register')
  @UseGuards(RegisterGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async register(@Body() registerDto: RegisterDto) {
    const result = await this.authService.register(registerDto);
    return {
      user: result.user,
      telegramAge: result.telegramAge,
      pointsReceived: result.pointsReceived,
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with Telegram ID' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    return this.authService.login(loginDto.telegramId);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({
    status: 200,
    description: 'New tokens generated',
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const { access_token, refresh_token } =
      await this.authService.refreshTokens(refreshTokenDto.refresh_token);
    return { access_token, refresh_token };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ status: 200, description: 'Logged out successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async logout(@GetUser() user: User) {
    await this.authService.logout(user.id);
    return { message: 'Logged out successfully' };
  }
}
