import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { EncryptionModule } from '../encryption/encryption.module';
import { PostsModule } from '../posts/posts.module';
import { CommentsModule } from '../comments/comments.module';

@Module({
<<<<<<< HEAD
  imports: [
    EncryptionModule,
    forwardRef(() => PostsModule),
    forwardRef(() => CommentsModule),
  ],
=======
  imports: [EncryptionModule, forwardRef(() => PostsModule), forwardRef(() => CommentsModule)],
>>>>>>> Added get (getMyPosts, getMyCommets) requests in UserModule controller
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
