import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, ObjectId } from 'mongoose';

export type LikesDocument = Document & Likes;

@Schema()
export class Likes {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Post' })
  post_id: ObjectId;

  @Prop()
  liked_users: any[];
}

export const LikesSchema = SchemaFactory.createForClass(Likes);
