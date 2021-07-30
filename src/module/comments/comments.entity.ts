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
import { Post } from '../posts/posts.entity';
=======
>>>>>>> Added get (getMyPosts, getMyCommets) requests in UserModule controller

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
