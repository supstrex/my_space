import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MessageDocument = Document & MessageRoom;

@Schema()
export class MessageRoom {
  @Prop()
  user1Id: string;

  @Prop()
  user2Id: string;

  @Prop()
  chats: any[];
}

export const MessageSchema = SchemaFactory.createForClass(MessageRoom);