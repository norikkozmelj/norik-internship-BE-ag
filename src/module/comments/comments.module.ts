<<<<<<< HEAD
import { Module } from '@nestjs/common';
=======
import { Module, forwardRef } from '@nestjs/common';
>>>>>>> Added get (getMyPosts, getMyCommets) requests in UserModule controller
import { PostsModule } from '../posts/posts.module';
import { PostsService } from '../posts/posts.service';
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
  imports: [forwardRef(() => UserModule),forwardRef(() =>  PostsModule)],
  controllers: [CommentsController],
<<<<<<< HEAD
  providers: [CommentsService]
>>>>>>> Added get (getMyPosts, getMyCommets) requests in UserModule controller
=======
  providers: [CommentsService, PostsService]
>>>>>>> Created post and comment relation, updated comment post request, so you can post comment to a post. Implemented endpoint where you can get all comments from specific post
})
export class CommentsModule {}
