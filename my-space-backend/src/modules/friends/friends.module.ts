import { MiddlewareForUsersRoute } from './users.middleware';
import { Friends, FriendsSchema } from './schema/friends.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { FriendsController } from './friends.controller';
import { FriendsService } from './friends.service';
import { UserSchema } from '../user/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Friends.name,
        schema: FriendsSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: 'User',
        schema: UserSchema,
      },
    ]), 
  ],
  controllers: [FriendsController],
  providers: [FriendsService],
  exports: [FriendsService],
})
export class FriendsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MiddlewareForUsersRoute).forRoutes('users/:user_id');
  }
}
