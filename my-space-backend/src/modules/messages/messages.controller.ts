import { MessagesService } from './messages.service';
import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('chats')
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  @Get()
  getUsersAllRooms(@Request() req: any) {
    console.log(req.user.userId);

    return this.messagesService.getAllRooms(req.user.userId);
  }

  @Get(':user_id')
  getOneRoom(@Request() req: any, @Param('user_id') messageToUser: string) {
    return this.messagesService.getOneRoom(req.user.userId, messageToUser);
  }
}
