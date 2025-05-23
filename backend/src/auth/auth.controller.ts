import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { InitDataDto } from './dtos/init-data.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: InitDataDto) {
    try {
      const user = this.authService.validateTelegramData(body.initData);
      const token = await this.authService.generateJwt(user);
      return { token };
    } catch (error) {
      throw new UnauthorizedException('Authentication failed', error);
    }
  }
}
