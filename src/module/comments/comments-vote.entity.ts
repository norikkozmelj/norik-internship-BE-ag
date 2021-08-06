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
import { Comment } from './comments.entity';
import { User } from '../user/user.entity';
import { CommentsVoteKey } from './enum/comments-vote-key.enum';

@Entity()
export class CommentsVote {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({description: "Vote of the comment. You can like or dislike comment", enum:['LIKE','DISLIKE']})
  @Column({ type: 'enum', enum: CommentsVoteKey })
  commentsVoteKey: CommentsVoteKey;

  @ApiProperty({type: () => User})
  @ManyToOne(() => User)
  @Transform(user => user.id)
  @JoinColumn({ name: 'user_id' })
  @Type(() => User)
  user: User;

  @ApiProperty({type: () => Comment})
  @ManyToOne(() => Comment)
  @Transform(comment => comment.id)
  @JoinColumn({ name: 'comment_id' })
  @Type(() => Comment)
  comment: Comment;

  @Exclude()
  @CreateDateColumn()
  created_at: Date;

  @Exclude()
  @UpdateDateColumn()
  updated_at: Date;
}
