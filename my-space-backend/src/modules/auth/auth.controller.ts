import { Controller, Post, Body } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserDto } from '../user/user-dtos/create-user.dto';
import { UserService } from '../user/user.service';
import { AuthDto } from './auth-dto/auth.dto';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('login')
  @ApiCreatedResponse({ description: 'You have successfully logged in.' })
  @ApiBadRequestResponse({ description: 'Bad Request.' })
  async login(@Body() authDto: AuthDto) {
    return this.authService.login(authDto);
  }

  @Post('register')
  @ApiOkResponse({
    status: 200,
    description: 'You have successfully registered.',
  })
  @ApiBadRequestResponse({ description: 'Bad Request.' })
  async register(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }
}
