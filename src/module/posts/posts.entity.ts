import {
<<<<<<< HEAD
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
=======
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Exclude, Type, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../user/user.entity';
import { Comment } from '../comments/comments.entity';
>>>>>>> Created post and comment relation, updated comment post request, so you can post comment to a post. Implemented endpoint where you can get all comments from specific post
  
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
    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    @Transform((user) => user.id)
    @Type(() => User)
    user: User;

    @ApiProperty({type: () => Comment})
    @OneToMany(() => Comment, comment => comment.post)
<<<<<<< HEAD
    @Type(() => Comment)
    @Transform((comments: Comment[] ) => comments.map(comment => comment.id))
=======
    //@JoinColumn({ name: 'comment_id' })
    @Type(() => Comment)
>>>>>>> Created post and comment relation, updated comment post request, so you can post comment to a post. Implemented endpoint where you can get all comments from specific post
    comments: Comment[];

    @CreateDateColumn()
    created_at: Date;

    @Exclude()
    @UpdateDateColumn()
    updated_at: Date;

  }
  