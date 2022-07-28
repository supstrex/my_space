import * as mongoose from 'mongoose';

export const CommentSchema = new mongoose.Schema({
  postId: { type: String, required: true },
  comments: { type: Array }
});
