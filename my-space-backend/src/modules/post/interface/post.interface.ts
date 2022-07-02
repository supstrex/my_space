export interface Post extends Document {
  id?: string;
  userId: string;
  originalName?: string;
  imagePath?: string;
  title: string;
  desc: string;
}
