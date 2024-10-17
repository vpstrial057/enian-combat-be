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
import { JwtAuthGuard } from './guards/auth.guard';
import { RegisterDto } from './dto/register.dto';
import { UserResponseDto } from '@/app/user/dto/user-response.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { GetUser } from './decorators/get-user.decorator';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { TestTokenBodyDto } from './dto/test-token-body.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @Post('get-test-token')
  @ApiOperation({ summary: 'Get registration token for testing' })
  @ApiResponse({
    status: 200,
    description: 'Registration token generated successfully',
  })
  async getTestToken(
    @Body() body: TestTokenBodyDto,
  ): Promise<{ token: string }> {
    const payload = {
      sub: body.telegramId,
      telegramId: body.telegramId,
      iat: Math.floor(Date.now() / 1000),
    };

    const token = this.jwtService.sign(payload, {
      expiresIn: '5m',
      secret: process.env.JWT_SECRET,
    });

    return { token };
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
}
