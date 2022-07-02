import { ObjectId } from 'mongoose';

export class FriendRequestAcceptedEvent {
  constructor(
    public readonly toUserId: string | ObjectId,
    public readonly fromUserId: string | ObjectId,
  ) {}
}
