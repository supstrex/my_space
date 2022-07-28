import * as mongoose from 'mongoose';

export const PostSchema = new mongoose.Schema({
  userId: { type: String, required: true } ,
  originalName: { type: String, required: false },
  imagePath: { type: String, required: false },
  title: { type: String },
  desc: { type: String }
});
