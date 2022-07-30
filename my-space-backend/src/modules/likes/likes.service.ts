import { Likes, LikesDocument } from './schema/likes.schema';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class LikesService {
  constructor(
    @InjectModel(Likes.name) private likesModel: Model<LikesDocument>,
  ) {}

  async getCurrentPostLikes(requested_post_id: string) {
    const currentPost = await this.likesModel.findOne({
      post_id: requested_post_id,
    });

    if (!currentPost) {
      const newPost = new this.likesModel({
        post_id: requested_post_id,
        liked_users: [],
      });
      return (await newPost.save()).liked_users;
    }

    return (await this.likesModel.findOne({ post_id: requested_post_id }))
      .liked_users;
  }

  async postCurrentPostLikes(user: any, requested_post_id: string) {
    const currentPost = await this.likesModel.findOne({
      post_id: requested_post_id,
    });

    if (!currentPost) {
      const newPost = new this.likesModel({
        post_id: requested_post_id,
        liked_users: [{ userId: user.userId }],   
      });
      return (await newPost.save()).liked_users;
    } else if (
      currentPost.liked_users.find((liker) => user.userId === liker.userId)
    ) {
      throw new HttpException(
        'Requested user already liked current post',
        HttpStatus.FORBIDDEN,
      );
    }

    currentPost.liked_users.push({ userId: user.userId });
    await this.likesModel.findOneAndUpdate(
      { post_id: requested_post_id },
      { liked_users: currentPost.liked_users },
    );
    return currentPost.liked_users;
  }

  async deleteCurrentPostLikes(user: any, requested_post_id: string) {
    const currentPostLikes = (
      await this.likesModel.findOne({ post_id: requested_post_id })
    ).liked_users;
    const requestedUser = currentPostLikes.find(
      (liker) => user.userId === liker.userId,
    );

    if (!requestedUser) {
      throw new HttpException(
        'Requested User doesnt liked current post yet',
        HttpStatus.FORBIDDEN,
      );
    }
    const filteredArray = currentPostLikes.filter(
      (user) => user.userId !== requestedUser.userId,
    );

    await this.likesModel.updateOne(
      { post_id: requested_post_id },
      { liked_users: filteredArray },
    );
    return filteredArray;
  }
}
