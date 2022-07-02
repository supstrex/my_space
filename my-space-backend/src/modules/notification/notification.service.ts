import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FriendRequestAcceptedEvent } from '../events/friend-request-accepted.event';
import { FriendRequestEvent } from '../events/friend-request.event';
import { PostCommentedEvent } from '../events/post-commented.event copy';
import { PostLikedEvent } from '../events/post-liked.event';
import { Notif } from './notification.schema';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel('Notification')
    private readonly notificationModel: Model<Notif>,
  ) {}

  //creates notification for a post like
  @OnEvent('liked.post', { async: true })
  async likeNotification(payload: PostLikedEvent): Promise<void> {
    if (payload.fromUserId !== payload.toUserId) {
      const newLikeNotification = new this.notificationModel({
        read: false,
        message: 'liked your post',
        postId: payload.postId,
        toUserId: payload.toUserId,
        fromUserId: payload.fromUserId,
        date: Date.now(),
      });
      await newLikeNotification.save();
    }
  }

  //creates notification for a post comment
  @OnEvent('commented.post', { async: true })
  async commentNotification(payload: PostCommentedEvent): Promise<void> {
    if (payload.fromUserId !== payload.toUserId) {
      const newCommentNotification = new this.notificationModel({
        read: false,
        message: 'commented your post',
        postId: payload.postId,
        toUserId: payload.toUserId,
        fromUserId: payload.fromUserId,
        date: Date.now(),
      });
      await newCommentNotification.save();
    }
  }

  //deletes notification in case of unliking post or deleting a comment
  @OnEvent('delete.notification', { async: true })
  async deleteNotification(id: string): Promise<void> {
    await this.notificationModel.deleteOne({ id });
  }

  //sends unread notifications (uses Sse)
  async sendNewNotifications(toUserId: string): Promise<Notif[]> {
    const a = await this.notificationModel
      .find({ toUserId, read: false })
      .exec();
    console.log(a);
    return a;
  }

  //sends all notifications
  async sendAllNotifications(toUserId: string): Promise<Notif[]> {
    return await this.notificationModel.find({ toUserId }).exec();
  }

  //changes the status of read parameter in case of notification reading
  async readNotification(id: string): Promise<void> {
    try {
      await this.notificationModel.findByIdAndUpdate(id, { read: true });
    } catch (error) {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  //creates notification for friend request
  @OnEvent('friend.request', { async: true })
  async friendRequestNotification(payload: FriendRequestEvent): Promise<void> {
    const newFriendRequestNotification = new this.notificationModel({
      read: false,
      message: 'wants to be your friend',
      toUserId: payload.toUserId,
      fromUserId: payload.fromUserId,
      date: Date.now(),
    });
    await newFriendRequestNotification.save();
  }

  //creates notification for accepting friend request
  @OnEvent('friend.request.accepted', { async: true })
  async acceptedFriendRequestNotification(
    payload: FriendRequestAcceptedEvent,
    id: string,
  ): Promise<void> {
    await this.notificationModel.deleteOne({ id });
    const newFriendRequestAcceptedNotification = new this.notificationModel({
      read: false,
      message: 'accepted your friend request',
      toUserId: payload.toUserId,
      fromUserId: payload.fromUserId,
      date: Date.now(),
    });
    await newFriendRequestAcceptedNotification.save();
  }
}
