<<<<<<< HEAD
import { forwardRef, Module } from '@nestjs/common';
=======
import { Module, forwardRef } from '@nestjs/common';
>>>>>>> Added get (getMyPosts, getMyCommets) requests in UserModule controller
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { UserModule } from '../user/user.module';
import { CommentsModule } from '../comments/comments.module';

@Module({
<<<<<<< HEAD
  imports: [forwardRef(() => UserModule), forwardRef(() => CommentsModule)],
=======
  imports: [forwardRef(() => UserModule)],
>>>>>>> Added get (getMyPosts, getMyCommets) requests in UserModule controller
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule {}
