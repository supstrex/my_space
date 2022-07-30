import { ObjectId } from 'mongoose';
import { FriendsService } from './friends.service';
import {
  Controller,
  Delete,
  Post,
  Get,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('users/:user_id/friends')
@Controller('users/:user_id/friends')
export class FriendsController {
  constructor(private friendsService: FriendsService) {}

  @Get()
  @ApiParam({
    name: 'user_id',
    type: 'string',
  })
  @ApiOkResponse({ description: 'user`s friends successfully found' })
  @ApiBadRequestResponse({
    description: 'Requested user id is not found in DB',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized User.' })
  async getAllFriends(@Param('user_id') user_id: ObjectId) {
    return this.friendsService.getAllFriends(user_id);
  }

  @Get('friend_requests')
  @ApiParam({
    name: 'user_id',
    type: 'string',
  })
  @ApiOkResponse({ description: 'user`s friends requests found' })
  @ApiBadRequestResponse({
    description: 'Requested user id is not found in DB',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized User.' })
  async getUsersFriendRequests(@Param('user_id') user_id: ObjectId) {
    return this.friendsService.getUsersFriendRequests(user_id);
  }

  @Post()
  @ApiParam({
    name: 'user_id',
    type: 'string',
  })
  @ApiOkResponse({ description: 'request successfully done' })
  @ApiBadRequestResponse({
    description:
      'requested users are already friends OR please wait for user`s answer',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized User.' })
  async addNewFriend(@Param('user_id') user_id: ObjectId, @Request() req: any) {
    return this.friendsService.addNewFriend(user_id, req.user.userId);
  }

  @Delete()
  @ApiParam({
    name: 'user_id',
    type: 'string',
  })
  @ApiOkResponse({
    description: 'Request for delete friend successfully complete',
  })
  @ApiBadRequestResponse({
    description:
      'User doesnt have any friends yet OR requested users doesnt were friends before',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized User.' })
  async deleteCurrentFriend(
    @Param('user_id') user_id: ObjectId,
    @Request() req: any,
  ) {
    return this.friendsService.deleteCurrentFriend(user_id, req.user.userId);
  }
}
