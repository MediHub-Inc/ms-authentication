/* eslint-disable @typescript-eslint/require-await */
import { Controller, Post, Body, Res, Get } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { SignUpDto } from './dto/signup.dto';
import { AuthenticateDto } from './dto/authenticate.dto';
import { Response } from 'express';
@Controller('authenticate')
export class AuthenticationController {
  constructor(private authService: AuthenticationService) {}

  @Post()
  async authenticate(@Body() authenticateDto: AuthenticateDto) {
    return this.authService.authenticate(authenticateDto);
  }

  @Post('signup')
  async signup(@Body() signupDto: SignUpDto) {
    return this.authService.signup(signupDto);
  }

  @Get('logout')
  async logout(@Res() response: Response) {
    response.clearCookie('accessToken');

    response.clearCookie('refreshToken');

    return response.status(200).json({ message: 'Logged out successfully' }); // ✅ Envía la respuesta
  }
}
