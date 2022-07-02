import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreatePostDto } from './dto/create-post.dto';
import { Post as PostInterface } from './interface/post.interface';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectModel('Post') private readonly postModel: Model<PostInterface>,
  ) {}

  async createPost(file, userId, createPostDto: CreatePostDto) {
    try {
      const newPost = new this.postModel({
        userId,
        title: createPostDto.title,
        desc: createPostDto.desc,
      });
      if (typeof file !== 'undefined') {
        newPost.originalName = file.originalname;
        newPost.imagePath = file.path;
      }
      const result = await newPost.save();
      return result;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
  async getPosts(): Promise<PostInterface[]> {
    return await this.postModel.find().exec();
  }
  async getPostById(id: string): Promise<PostInterface> {
    const post = await this.postModel.findById(id).exec();
    if (!post) {
      throw new NotFoundException('Could not find the post');
    }
    return post;
  }
  async update(
    id: string,
    updatePostDto: UpdatePostDto,
  ): Promise<PostInterface> {
    return await this.postModel.findByIdAndUpdate(id, updatePostDto, {
      new: true,
    });
  }
  async remove(id: string): Promise<void> {
    return await this.postModel.findByIdAndRemove(id);
  }
}
