import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './auth-dto/auth.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }
  async validate(authDto: AuthDto): Promise<any> {
    const user = await this.authService.validateUser(authDto);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
