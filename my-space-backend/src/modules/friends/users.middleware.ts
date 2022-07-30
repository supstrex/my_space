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
import { User } from '../user/user-dtos/user';

@Injectable()
export class MiddlewareForUsersRoute implements NestMiddleware {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async use(req: Request, res: Response, next: NextFunction) {
    if (!mongoose.isValidObjectId(req.params.user_id)) {
      throw new HttpException(
        'typeof user id is not ObjectId',
        HttpStatus.BAD_REQUEST,
      );
    }

    const findPostIdFromPosts = await this.userModel.findOne({
      _id: req.params.user_id,
    });

    if (!findPostIdFromPosts) {
      throw new HttpException(
        'Requested user id is not found in DB',
        HttpStatus.BAD_REQUEST,
      );
    }
    next();
  }
}
