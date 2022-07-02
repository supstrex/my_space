import mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  Injectable,
  NestMiddleware,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Model } from 'mongoose';
import { Post as PostInterface } from '../post/interface/post.interface';

@Injectable()
export class MiddlewareForRoute implements NestMiddleware {
  constructor(
    @InjectModel('Post') private readonly postModel: Model<PostInterface>,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    if (!mongoose.isValidObjectId(req.params.post_id)) {
      throw new HttpException(
        'typeof post id is not ObjectId',
        HttpStatus.BAD_REQUEST,
      );
    }

    const findPostIdFromPosts = await this.postModel.findOne({
      _id: req.params.post_id,
    });

    if (!findPostIdFromPosts) {
      throw new HttpException(
        'Requested post id is not found in DB',
        HttpStatus.BAD_REQUEST,
      );
    }
    next();
  }
}
