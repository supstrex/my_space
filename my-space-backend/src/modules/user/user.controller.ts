import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Delete,
  Put,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './user-dtos/create-user.dto';
import { User } from './user-dtos/user';
import { UpdateUserDto } from './user-dtos/update-user.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  @Post()
  @ApiBody({
    description: 'Create new user.',
    type: CreateUserDto,
  })
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized User.' })
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const generatedId = await this.userService.createUser(createUserDto);
      return { id: generatedId };
    } catch (error) {
      throw new HttpException(error, HttpStatus.FORBIDDEN);
    }
  }

  @Get()
  @ApiOkResponse({ description: 'You have successfully received the users.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized User.' })
  async getAllUsers(): Promise<User[]> {
    return await this.userService.getUsers();
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ description: 'User is found.' })
  @ApiNotFoundResponse({ description: 'User is not found.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized User.' })
  async getUser(@Param('id') userId: string): Promise<User> {
    try {
      return await this.userService.getUserById(userId);
    } catch (error) {
      throw new NotFoundException(error);
    }
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ description: 'User is deleted.' })
  @ApiNotFoundResponse({ description: 'User is not found for Delete.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized User.' })
  async remove(@Param('id') userId: string): Promise<void> {
    this.userService.remove(userId);
  }

  @Put(':id')
  @ApiParam({ name: 'id', type: String })
  @ApiBody({
    description: 'User has been successfully updated.',
    type: UpdateUserDto,
  })
  @ApiCreatedResponse({ description: 'User has been successfully updated.' })
  @ApiBadRequestResponse({ description: 'Bad Request.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized User.' })
  async update(
    @Param('id') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.update(userId, updateUserDto);
  }
}
