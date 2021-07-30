<<<<<<< HEAD
import { Module } from '@nestjs/common';
=======
import { Module, forwardRef } from '@nestjs/common';
>>>>>>> Added get (getMyPosts, getMyCommets) requests in UserModule controller
import { PostsModule } from '../posts/posts.module';
import { UserModule } from '../user/user.module';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
<<<<<<< HEAD
import { forwardRef } from '@nestjs/common';

@Module({
  imports: [forwardRef(() => UserModule), forwardRef(() => PostsModule)],
  controllers: [CommentsController],
  providers: [CommentsService],
  exports: [CommentsService],
=======

@Module({
  imports: [forwardRef(() => UserModule), PostsModule],
  controllers: [CommentsController],
  providers: [CommentsService]
>>>>>>> Added get (getMyPosts, getMyCommets) requests in UserModule controller
})
export class CommentsModule {}
