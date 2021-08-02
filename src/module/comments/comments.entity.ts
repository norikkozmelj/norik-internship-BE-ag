import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Exclude, Type, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../user/user.entity';
import { Post } from '../posts/posts.entity';

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
  @Transform((user) => user.id)
  @JoinColumn({ name: 'user_id' })
  @Type(() => User)
  user: User;

  @ApiProperty({type: () => Post})
  @ManyToOne(() => Post, post => post.comments)
<<<<<<< HEAD
  @Transform((post) => post.id)
  @JoinColumn({ name: 'post_id' })
  @Type(() => Post)
  post: Post;
=======
  //@JoinColumn({ name: 'post_id' })
  @Type(() => Post)
  post: Post;

>>>>>>> Created post and comment relation, updated comment post request, so you can post comment to a post. Implemented endpoint where you can get all comments from specific post

  @CreateDateColumn()
  created_at: Date;

  @Exclude()
  @UpdateDateColumn()
  updated_at: Date;

}
