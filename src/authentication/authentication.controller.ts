import { Controller, Post, Body, Res, Get, HttpCode } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { SignUpDto } from './dto/signup.dto';
import { AuthenticateDto } from './dto/authenticate.dto';
import type { Response } from 'express';

@Controller('authenticate')
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

  @Post()
  @HttpCode(200) // ✅ Indicar explícitamente el status OK
  async authenticate(@Body() authenticateDto: AuthenticateDto) {
    return this.authService.authenticate(authenticateDto);
  }

  @Post('signup')
  @HttpCode(201) // ✅ Status de creación
  async signup(@Body() signupDto: SignUpDto) {
    return this.authService.signup(signupDto);
  }

  @Get('logout')
  @HttpCode(200)
  async logout(@Res() res: Response) {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    return res.json({ message: 'Logged out successfully' });
  }
}
