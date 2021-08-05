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
  @ApiProperty({example: 1})
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({example: "Dončić is the best player in the world RN!"})
  @Column()
  title: string;

  @ApiProperty({example: "Slovenia plays well, I think they can win a medal!"})
  @Column()
  content: string;

  @ApiProperty({description: "How many times the post was viewed", example: "123"})
  @Column({
    type: 'integer',
    default: 0,
  })
  views: number;

  @ApiProperty({description: "Author of the post", type: () => User })
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  @Transform(user => user.id)
  @Type(() => User)
  user: User;

  @ApiProperty({description: "Comments of the post", type: () => Comment })
  @OneToMany(
    () => Comment,
    comment => comment.post,
  )
  @Type(() => Comment)
  @Transform((comments: Comment[]) => comments.map(comment => comment.id))
  comments: Comment[];

  @ApiProperty({description: "Date and time when the post was created", example: "2021-08-15T14:00:00.000Z"})
  @CreateDateColumn()
  created_at: Date;

  @Exclude()
  @UpdateDateColumn()
  updated_at: Date;
}
