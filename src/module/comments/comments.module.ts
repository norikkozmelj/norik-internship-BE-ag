import { Module } from '@nestjs/common';
import { PostsModule } from '../posts/posts.module';
import { PostsService } from '../posts/posts.service';
import { UserModule } from '../user/user.module';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { forwardRef } from '@nestjs/common';

@Module({
<<<<<<< HEAD
  imports: [UserModule, forwardRef(() => PostsModule)],
  controllers: [CommentsController],
  providers: [CommentsService],
  exports: [CommentsService],
=======
  imports: [forwardRef(() => UserModule),forwardRef(() =>  PostsModule)],
  controllers: [CommentsController],
  providers: [CommentsService, PostsService]
>>>>>>> Created post and comment relation, updated comment post request, so you can post comment to a post. Implemented endpoint where you can get all comments from specific post
})
export class CommentsModule {}
