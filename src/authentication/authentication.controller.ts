import { Controller, Post, Body } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { SignUpDto } from './dto/signup.dto';

@Controller('authenticate')
export class AuthenticationController {
  constructor(private authService: AuthenticationService) {}

  @Post()
  async authenticate(@Body() { email, username, password }: any) {
    return this.authService.authenticate(email, username, password);
  }

  @Post('signup')
  async signup(@Body() signupDto: SignUpDto) {
    return this.authService.signup(signupDto);
  }
}
