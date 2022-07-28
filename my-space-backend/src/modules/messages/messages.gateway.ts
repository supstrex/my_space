import { AuthGuard } from '@nestjs/passport';
import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Server, Socket } from 'socket.io';
import { ConflictException, HttpException, HttpStatus, Param, Request, UseGuards } from '@nestjs/common';


@WebSocketGateway({
  cors: {
    origin: "*",
  },
})
export class MessagesGateway {
  constructor(private messagesService: MessagesService) {} 

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('createMessage')
  async create(@MessageBody() createMessageDto: CreateMessageDto) {
    console.log(createMessageDto.text);
    
    const message = await this.messagesService.createMessage(createMessageDto).catch((e) => {
      return 
    })
    this.server.emit('message', message);
    
    return message;
  }

  // Alternative solution
  @SubscribeMessage('join')
  joinRoom(@MessageBody() body: any) {
    
    return this.messagesService.getRoomForJoin(body.id,body.user.userId)
  }
}