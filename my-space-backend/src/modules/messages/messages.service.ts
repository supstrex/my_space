import { MessageDocument, MessageRoom } from './schema/message.schema';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(MessageRoom.name) private messageRoom: Model<MessageDocument>,
  ) {}

  async createMessage(createMessageDto: CreateMessageDto) {
    const chat_id = createMessageDto.id;
    const room = await this.messageRoom.findById({_id: chat_id});

    if (!createMessageDto.text.trim()) {
      throw new HttpException("inputed text is empty",HttpStatus.FORBIDDEN)
    }

    const message = {
      text: createMessageDto.text,
      user: createMessageDto.user
    };
    
    room.chats.push(message);
    await this.messageRoom.updateOne(
      {_id: chat_id},
      {chats: room.chats}
      )

    return message;
  }

  async getAllRooms(user_id: string) {
    let usersAllMessages = await this.messageRoom.find({user1Id: user_id});
    let usersAllMessages2 = await this.messageRoom.find({user2Id: user_id});

    return [...usersAllMessages, ...usersAllMessages2]
  }

  async getOneRoom(user_id: string, messageToUser: string) {
    let oneRoom = await this.messageRoom.findOne({$or:[{ user1Id: user_id, user2Id: messageToUser }, { user1Id: messageToUser, user2Id: user_id, }]});

    if (oneRoom) {
      return oneRoom.chats
    } else {
      const newRoom = new this.messageRoom({
        user1Id: user_id,
        user2Id: messageToUser,
        chats: []
      });
      
      await newRoom.save()

      return newRoom.chats
    }
  }

  // Alternative solution
  async getRoomForJoin(chat_id: string,user_id: string) {
    const room = await this.messageRoom.findById({_id: chat_id});

    if(room.user1Id === user_id || room.user2Id === user_id) {
      return room.chats;
    }

  }
}
