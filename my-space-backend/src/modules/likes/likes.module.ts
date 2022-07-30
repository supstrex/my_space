import { MongooseModule } from '@nestjs/mongoose';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LikesController } from './likes.controller';
import { LikesService } from './likes.service';
import { Likes, LikesSchema } from './schema/likes.schema';
import { PostSchema } from '../post/post.schema';
import { MiddlewareForRoute } from './route.middleware';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Likes.name, schema: LikesSchema }]),
    MongooseModule.forFeature([{ name:'Post', schema: PostSchema }]),
  ],
  controllers: [LikesController],
  providers: [LikesService],
  exports: [LikesService],
})
export class LikesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MiddlewareForRoute).forRoutes('likes/:post_id');
  }
}
