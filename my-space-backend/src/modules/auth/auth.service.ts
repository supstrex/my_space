import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthDto } from './auth-dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(authDto: AuthDto): Promise<any> {
    const user = await this.usersService.getUserByEmail(authDto.email);
    if (user && (await bcrypt.compare(authDto.password, user.password))) {
      const { email, id } = user;
      return { email, id };
    }
    return null;
  }

  async login(authDto: AuthDto) {
    const validUser = await this.validateUser(authDto);

    if (!validUser) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    const payload = { email: validUser.email, sub: validUser.id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
