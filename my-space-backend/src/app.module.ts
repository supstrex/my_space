import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { PostModule } from './modules/post/post.module';
import { LikesModule } from './modules/likes/likes.module';
import { FriendsModule } from './modules/friends/friends.module';
import { CommentModule } from './modules/comment/comment.module';
import { NotificationModule } from './modules/notification/notification.module';
import { MessagesModule } from './modules/messages/messages.module';
@Module({
  imports: [
    AuthModule,
    UserModule,
    PostModule,
    LikesModule,
    CommentModule,
    FriendsModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGODB),
    NotificationModule,
    MessagesModule,
  ],
})
export class AppModule {}
