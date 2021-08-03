import { Module } from '@nestjs/common';
import { PostsModule } from '../posts/posts.module';
import { UserModule } from '../user/user.module';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { forwardRef } from '@nestjs/common';

@Module({
  imports: [UserModule, forwardRef(() => PostsModule)],
  controllers: [CommentsController],
  providers: [CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}
