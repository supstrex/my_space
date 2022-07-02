import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './interface/comment.interface';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel('Comment') private readonly commentModel: Model<Comment>,
  ) {}

  async postComment(
    postId: string,
    userId: string,
    commentPostDto: CreateCommentDto,
  ): Promise<Object> {
    const post = await this.commentModel.findOne({ postId });
    if (!post) {
      const newComment = new this.commentModel({
        postId: postId,
        comments: [
          {
            id: new mongoose.Types.ObjectId(),
            commentedUser: userId,
            comment: commentPostDto.comment,
          },
        ],
      });
      const result = await newComment.save();
      return result;
    }

    post.comments.push({
      id: new mongoose.Types.ObjectId(),
      commentedUser: userId,
      comment: commentPostDto.comment,
    });
    await this.commentModel.findOneAndUpdate(
      { post_id: postId },
      { comments: post.comments },
    );
    return post.comments;
  }

  async findAllComment(postId: string): Promise<Object> {
    return (await this.commentModel.findOne({ postId })).comments;
  }

  async updateComment(
    postId: string,
    commentId: string,
    updateCommentDto: UpdateCommentDto,
  ): Promise<Comment> {
    const post = (await this.commentModel.findOne({ postId })).comments;
    if (!post) {
      throw new HttpException('Post does not exist', HttpStatus.BAD_REQUEST);
    }
    const filteredArray = post.filter((comment) => {
      if (comment.id == commentId) {
        comment.comment = updateCommentDto.comment;
        return comment;
      } else {
        throw new HttpException(
          'Comment does not exist',
          HttpStatus.BAD_REQUEST,
        );
      }
    });

    return await this.commentModel.findOneAndUpdate(
      { postId },
      { comments: filteredArray },
      {
        new: true,
      },
    );
  }

  async removeComment(postId: string, commentId: string): Promise<void> {
    const post = (await this.commentModel.findOne({ postId })).comments;
    const deleteComment = await post.find((comment) => {
      return comment.id == commentId;
    });

    if (deleteComment) {
      const filteredArray = post.filter(
        (comment) => comment.id !== deleteComment.id,
      );
      await this.commentModel.findOneAndUpdate(
        { postId },
        {
          comments: filteredArray,
        },
        { new: true },
      );
      return;
    }
  }
}
