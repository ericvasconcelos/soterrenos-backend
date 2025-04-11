import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ResponseLoginDto } from './dto/response-login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  login(@Body() loginDto: LoginDto): Promise<ResponseLoginDto> {
    return this.authService.login(loginDto)
  }

  @Post('refresh')
  refreshToken(@Body() refreshTokenDto: RefreshTokenDto): Promise<ResponseLoginDto> {
    return this.authService.refreshToken(refreshTokenDto)
  }
}
