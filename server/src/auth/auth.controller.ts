import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('google')
  async googleLogin(@Body() body: { access_token: string }) {
    return this.authService.googleLogin(body.access_token);
  }

  @Get('verify/:token')
  async me(@Param('token') token: string) {
    return this.authService.verifyToken(token);
  }

  @Post('register')
  async register(@Body() body: { name: string; email: string }) {
    return this.authService.register(body);
  }

  @Post('login')
  async login(@Body() body: { email: string }) {
    return this.authService.login(body);
  }
}
