<<<<<<< HEAD
import { forwardRef, Module } from '@nestjs/common';
=======
import { Module, forwardRef } from '@nestjs/common';
>>>>>>> Added get (getMyPosts, getMyCommets) requests in UserModule controller
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { UserModule } from '../user/user.module';
import { CommentsModule } from '../comments/comments.module';
<<<<<<< HEAD

@Module({
<<<<<<< HEAD
  imports: [forwardRef(() => UserModule), forwardRef(() => CommentsModule)],
=======
  imports: [forwardRef(() => UserModule)],
>>>>>>> Added get (getMyPosts, getMyCommets) requests in UserModule controller
=======


@Module({
  imports: [forwardRef(() => UserModule), forwardRef(() => CommentsModule)],
>>>>>>> Created post and comment relation, updated comment post request, so you can post comment to a post. Implemented endpoint where you can get all comments from specific post
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule {}
