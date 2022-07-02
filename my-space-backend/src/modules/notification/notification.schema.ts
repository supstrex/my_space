import * as mongoose from 'mongoose';

export const NotificationSchema = new mongoose.Schema({
  read: { type: Boolean, required: true, default: false },
  message: { type: String, required: true },
  postId: { type: String, required: true },
  toUserId: { type: String, required: true },
  fromUserId: { type: String, required: true },
  date: { type: Date, required: true },
});

export interface Notif extends Document {
  id?: string;
  read: boolean;
  message: string;
  postId: string;
  toUserId: string;
  fromUserId: string;
}
