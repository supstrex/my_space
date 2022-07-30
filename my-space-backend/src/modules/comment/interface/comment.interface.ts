export interface Comment extends Document {
  id?: string;
  postId: string;
  comments: any[];
}
