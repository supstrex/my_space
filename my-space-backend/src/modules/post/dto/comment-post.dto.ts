import { CreatePostDto } from './create-post.dto';

export class CommentPostDto extends CreatePostDto {
  content: string;
}
