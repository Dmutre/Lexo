import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation } from '@nestjs/swagger';
import { RegistrationDto } from './dto/registration.dto';
import { TokensDto } from './dto/tokens.dto';
import { LoginDto } from './dto/login.dto';
import { UserResponse } from './dto/user.response';
import { AuthGuard } from './guards/auth.guard';
import { TokenDto } from './dto/token.dto';
import type { UserRequest } from '../../common/types/user-request';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @ApiOperation({ summary: 'Register a new user' })
  register(@Body() data: RegistrationDto): Promise<TokensDto> {
    return this.authService.registerUser(data);
  }

  @Post('/login')
  @ApiOperation({ summary: 'Login user' })
  login(@Body() data: LoginDto): Promise<TokensDto> {
    return this.authService.loginUser(data);
  }

  @Post('/refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  refreshTokens(@Body() { token: refreshToken }: TokenDto): Promise<TokensDto> {
    return this.authService.refreshTokens(refreshToken);
  }

  @UseGuards(AuthGuard)
  @Get('/me')
  @ApiOperation({ summary: 'Get current user info' })
  getMe(@Req() request: UserRequest): UserResponse {
    const { password, ...userData } = request.user;
    return userData;
  }
}
