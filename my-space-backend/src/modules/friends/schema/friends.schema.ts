import mongoose, { ObjectId } from 'mongoose';
import { SchemaFactory } from '@nestjs/mongoose';
import { Prop, Schema } from '@nestjs/mongoose';

export type FriendsDocument = Document & Friends;

@Schema()
export class Friends {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user_id: ObjectId;

  @Prop()
  friends: any[];
}

export const FriendsSchema = SchemaFactory.createForClass(Friends);
