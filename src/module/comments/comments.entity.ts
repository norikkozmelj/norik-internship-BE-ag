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
import { Exclude, Type, Transform, Expose } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { User } from '../user/user.entity';
import { Post } from '../posts/posts.entity';
import { CommentsVote } from './comments-vote.entity';
import { CommentsVoteKey } from './enum/comments-vote-key.enum';

@Entity()
export class Comment {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'You are right, Dončić is the beast' })
  @Column()
  content: string;

  @ApiProperty({ type: () => User })
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

  @ApiProperty({ type: () => CommentsVote })
  @OneToMany(
    () => CommentsVote,
    commentsVote => commentsVote.comment,
  )
  @Type(() => CommentsVote)
  @Transform((commentsVotes: CommentsVote[]) =>
    commentsVotes.map(vote => vote.id),
  )
  commentsVotes: CommentsVote[];

  @Expose({ name: 'score'})
  @ApiProperty({description: 'Sum of likes and dislikes', example: -2})
  getScore(){
    var score = 0;
    this.commentsVotes.map(vote => (vote.commentsVoteKey == CommentsVoteKey.LIKE) ? score++ : score--);
    return score;
  }

  @ApiPropertyOptional({example: '2021-08-15T18:00:00.000Z'})
  @CreateDateColumn()
  created_at: Date;

  @Exclude()
  @UpdateDateColumn()
  updated_at: Date;
}
