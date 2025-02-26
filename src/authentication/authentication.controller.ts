import { Controller, Post, Body } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { SignUpDto } from './dto/signup.dto';
import { AuthenticateDto } from './dto/authenticate.dto';

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
}
