import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Exclude, Type, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../user/user.entity';
import { Comment } from '../comments/comments.entity';

@Entity()
export class Post {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty()
  @Column()
  content: string;

  @ApiProperty()
  @Column({
    type: 'integer',
    default: 0,
  })
  views: number;

  @ApiProperty()
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  @Transform(user => user.id)
  @Type(() => User)
  user: User;

  @ApiProperty({ type: () => Comment })
  @OneToMany(
    () => Comment,
    comment => comment.post,
  )
  @Type(() => Comment)
  @Transform((comments: Comment[]) => comments.map(comment => comment.id))
  comments: Comment[];

  @CreateDateColumn()
  created_at: Date;

  @Exclude()
  @UpdateDateColumn()
  updated_at: Date;
}
