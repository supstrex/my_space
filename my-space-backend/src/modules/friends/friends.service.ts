import { Model, ObjectId } from 'mongoose';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Friends, FriendsDocument } from './schema/friends.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class FriendsService {
  constructor(
    @InjectModel(Friends.name)
    private readonly friendsModel: Model<FriendsDocument>,
  ) {}

  async getAllFriends(user_id: ObjectId) {
    const friendsOfUser = await this.friendsModel.findOne({ user_id });

    if (!friendsOfUser) {
      this.createForDB(user_id);
    }

    return (await this.friendsModel.findOne({ user_id })).friends.filter(
      (user) => user.status === 'accepted',
    );
  }

  async getUsersFriendRequests(user_id: ObjectId) {
    let friendsOfUser = await this.friendsModel.findOne({ user_id });

    if (!friendsOfUser) {
      friendsOfUser = await this.createForDB(user_id);
    }

    return (await this.friendsModel.findOne({ user_id })).friends.filter(
      (user) => user.status === 'requested',
    );
  }

  async addNewFriend(user_id: ObjectId, requested_userId: ObjectId) {
    await this.validationOfUsers(user_id, requested_userId);

    let friendsOfUser = await this.friendsModel.findOne({ user_id });
    let friendsOfRequestedUser = await this.friendsModel.findOne({
      user_id: requested_userId,
    });

    if (!friendsOfUser) {
      friendsOfUser = await this.createForDB(user_id);
    }
    if (!friendsOfRequestedUser) {
      friendsOfRequestedUser = await this.createForDB(requested_userId);
    }

    const findUserInFriends = friendsOfUser.friends.find(
      (user: { user_id: any }) => requested_userId === user.user_id,
    );

    if (findUserInFriends)
      switch (findUserInFriends.status) {
        case 'accepted':
          throw new HttpException(
            'requested users are already friends',
            HttpStatus.BAD_REQUEST,
          );

        case 'pending':
          findUserInFriends.status = 'accepted';

          friendsOfRequestedUser.friends.find(
            (user) => user.user_id === user_id,
          ).status = 'accepted';
          friendsOfUser.friends.find(
            (user) => user.user_id === requested_userId,
          ).status = 'accepted';

          await this.friendsModel.updateOne(
            { user_id: requested_userId },
            { friends: friendsOfRequestedUser.friends },
          );
          await this.friendsModel.updateOne(
            { user_id },
            { friends: friendsOfUser.friends },
          );
          return { user_id, status: 'accepted' };

        case 'requested':
          throw new HttpException(
            "please wait for user's answer",
            HttpStatus.BAD_REQUEST,
          );
        case 'initial':
          findUserInFriends.status = 'pending';

          friendsOfRequestedUser.friends.find(
            (user) => user.user_id === user_id,
          ).status = 'pending';
          friendsOfUser.friends.find(
            (user) => user.user_id === requested_userId,
          ).status = 'requested';

          await this.friendsModel.updateOne(
            { user_id: requested_userId },
            { friends: friendsOfRequestedUser.friends },
          );
          await this.friendsModel.updateOne(
            { user_id },
            { friends: friendsOfUser.friends },
          );
          return { user_id, status: 'pending' };
      }
    else {
      await this.friendsModel.updateOne(
        { user_id },
        {
          $push: {
            friends: {
              user_id: requested_userId,
              status: 'requested',
            },
          },
        },
      );
      await this.friendsModel.updateOne(
        { user_id: requested_userId },
        {
          $push: {
            friends: {
              user_id,
              status: 'pending',
            },
          },
        },
      );

      return {
        user_id: requested_userId,
        status: 'pending',
      };
    }
  }

  async deleteCurrentFriend(user_id: ObjectId, requestedFriend: ObjectId) {
    await this.validationOfUsers(user_id, requestedFriend);

    let friendsOfUser = await this.friendsModel.findOne({ user_id });
    const friendsOfRequestedUser = await this.friendsModel.findOne({
      user_id: requestedFriend,
    });

    if (!friendsOfUser) {
      friendsOfUser = await this.createForDB(user_id);
    }
    const findUserInFriends = friendsOfUser.friends.find(
      (user: { user_id: any }) => requestedFriend === user.user_id,
    );

    if (!friendsOfUser.friends.length) {
      throw new HttpException(
        'user doesnt have any friends yet',
        HttpStatus.FORBIDDEN,
      );
    } else if (findUserInFriends) {
      switch (findUserInFriends.status) {
        case 'accepted':
        case 'pending':
        case 'requested': {
          findUserInFriends.status = 'initial';

          friendsOfRequestedUser.friends.find(
            (user) => user.user_id === user_id,
          ).status = 'initial';
          friendsOfUser.friends.find(
            (user) => user.user_id === requestedFriend,
          ).status = 'initial';

          await this.friendsModel.updateOne(
            { user_id: requestedFriend },
            { friends: friendsOfRequestedUser.friends },
          );
          await this.friendsModel.updateOne(
            { user_id },
            { friends: friendsOfUser.friends },
          );
          return { user_id, status: 'initial' };
        }
        case 'initial':
          throw new HttpException(
            'requested users doesnt were friends before',
            HttpStatus.BAD_REQUEST,
          );
      }
    } else {
      throw new HttpException(
        'requested users doesnt were friends before',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async createForDB(user_id: ObjectId) {
    const newFieldOfFreinds = new this.friendsModel({
      user_id: user_id,
      friends: [],
    });
    await newFieldOfFreinds.save();

    return await this.friendsModel.findOne({ user_id: user_id });
  }

  async validationOfUsers(user_id: ObjectId, requested_userId: ObjectId) {
    if (user_id === requested_userId) {
      throw new HttpException(
        'requested user cannot send request himself',
        HttpStatus.FORBIDDEN,
      );
    }
  }
}
