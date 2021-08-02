import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
<<<<<<< HEAD
=======
  DeleteDateColumn,
>>>>>>> Added get (getMyPosts, getMyCommets) requests in UserModule controller
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Exclude, Type, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../user/user.entity';
<<<<<<< HEAD
<<<<<<< HEAD
import { Post } from '../posts/posts.entity';
=======
>>>>>>> Added get (getMyPosts, getMyCommets) requests in UserModule controller
=======
import { Post } from '../posts/posts.entity';
>>>>>>> Created post and comment relation, updated comment post request, so you can post comment to a post. Implemented endpoint where you can get all comments from specific post

@Entity()
export class Comment {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  content: string;

  @ApiProperty()
  @ManyToOne(() => User)
<<<<<<< HEAD
  @Transform(user => user.id)
=======
>>>>>>> Added get (getMyPosts, getMyCommets) requests in UserModule controller
  @JoinColumn({ name: 'user_id' })
  @Type(() => User)
  user: User;

<<<<<<< HEAD
<<<<<<< HEAD
  @ApiProperty({ type: () => Post })
  @ManyToOne(
    () => Post,
    post => post.comments,
  )
  @Transform(post => post.id)
  @JoinColumn({ name: 'post_id' })
  @Type(() => Post)
  post: Post;

=======
=======
  @ApiProperty({type: () => Post})
  @ManyToOne(() => Post, post => post.comments)
  //@JoinColumn({ name: 'post_id' })
  @Type(() => Post)
  post: Post;

>>>>>>> Created post and comment relation, updated comment post request, so you can post comment to a post. Implemented endpoint where you can get all comments from specific post

  @ApiProperty()
  @Column()
  date: Date;

  @Exclude()
>>>>>>> Added get (getMyPosts, getMyCommets) requests in UserModule controller
  @CreateDateColumn()
  created_at: Date;

  @Exclude()
  @UpdateDateColumn()
  updated_at: Date;
<<<<<<< HEAD
=======

>>>>>>> Added get (getMyPosts, getMyCommets) requests in UserModule controller
}
