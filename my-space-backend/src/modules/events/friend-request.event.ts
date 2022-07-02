import { ObjectId } from 'mongoose';

export class FriendRequestEvent {
  constructor(
    public readonly toUserId: string | ObjectId,
    public readonly fromUserId: string | ObjectId,
  ) {}
}
