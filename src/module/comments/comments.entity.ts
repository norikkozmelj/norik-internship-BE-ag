import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Exclude, Type, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../user/user.entity';
import { Post } from '../posts/posts.entity';
import { CommentsVote } from './comments-vote.entity';

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
  @Transform(user => user.id)
  @JoinColumn({ name: 'user_id' })
  @Type(() => User)
  user: User;

  @ApiProperty({ type: () => Post })
  @ManyToOne(
    () => Post,
    post => post.comments,
  )
  @Transform(post => post.id)
  @JoinColumn({ name: 'post_id' })
  @Type(() => Post)
  post: Post;

  @ApiProperty()
  @OneToMany(
    () => CommentsVote,
    commentsVote => commentsVote.comment,
  )
  @Type(() => CommentsVote)
  @Transform((commentsVotes: CommentsVote[]) =>
    commentsVotes.map(vote => vote.id),
  )
  commentsVotes: CommentsVote[];

  @CreateDateColumn()
  created_at: Date;

  @Exclude()
  @UpdateDateColumn()
  updated_at: Date;
}
