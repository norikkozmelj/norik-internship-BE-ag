import { forwardRef, Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { UserModule } from '../user/user.module';
import { CommentsModule } from '../comments/comments.module';


@Module({
  imports: [UserModule, forwardRef(() => CommentsModule)],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule {}
