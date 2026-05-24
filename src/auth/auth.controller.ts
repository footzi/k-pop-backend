import { Controller, Get, Post, Body } from '@nestjs/common';
import { StartLoginDto } from './dto/start-login.dto';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('start-login')
  async startLogin(@Body() startLoginDto: StartLoginDto) {
    await this.authService.startAuth(startLoginDto.email);

    return {
      success: true,
    };
  }
}
