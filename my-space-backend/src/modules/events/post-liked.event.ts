export class PostLikedEvent {
  constructor(
    public readonly postId: string,
    public readonly toUserId: string,
    public readonly fromUserId: string,
  ) {}
}
