import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createHmac } from 'crypto';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  validateTelegramData(initData: string): any {
    const params = new URLSearchParams(initData);
    const hash = params.get('hash');
    params.delete('hash');
    const dataCheckString = Array.from(params.entries())
      .sort()
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');
    const secretKey = createHmac('sha256', 'WebAppData')
      .update(process.env.BOT_TOKEN as any)
      .digest();
    const calculatedHash = createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    if (calculatedHash !== hash) {
      throw new UnauthorizedException('Invalid Telegram data');
    }

    const user = JSON.parse(params.get('user') || '{}');
    return { id: user.id, username: user.username };
  }

  async generateJwt(user: any): Promise<string> {
    const payload = { sub: user.id, username: user.username };
    return this.jwtService.signAsync(payload, { expiresIn: '1h' });
  }
}
