import {
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> Created post and comment relation, updated comment post request, so you can post comment to a post. Implemented endpoint where you can get all comments from specific post
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
<<<<<<< HEAD
  OneToMany,
  ManyToOne,
  JoinColumn,
=======
  ManyToOne,
  JoinColumn,
  OneToMany,
>>>>>>> Created post and comment relation, updated comment post request, so you can post comment to a post. Implemented endpoint where you can get all comments from specific post
} from 'typeorm';
import { Exclude, Type, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../user/user.entity';
import { Comment } from '../comments/comments.entity';
<<<<<<< HEAD
=======
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { Exclude, Type, Transform } from 'class-transformer';
  import { ApiProperty } from '@nestjs/swagger';
  import { User } from '../user/user.entity';
=======
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
    @Type(() => User)
    user: User;
>>>>>>> Added Comments module, controller, service and dtos. Implemented get (getAll), post (create), delete and update requests. Only logged in users can make requests and only author of the comment can update or delete it.

<<<<<<< HEAD
@Entity()
export class Post {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;
=======
    @ApiProperty({type: () => Comment})
    @OneToMany(() => Comment, comment => comment.post)
    @Type(() => Comment)
    comments: Comment[];
>>>>>>> Created post and comment relation, updated comment post request, so you can post comment to a post. Implemented endpoint where you can get all comments from specific post

  @ApiProperty()
  @Column()
  title: string;

<<<<<<< HEAD
  @ApiProperty()
  @Column()
  content: string;
=======
    @ApiProperty()
    @Column({
      type: 'integer',
      default: 0
    })
    views: number;

    @Exclude()
    @CreateDateColumn()
    created_at: Date;
>>>>>>> Update of get one post by id request

<<<<<<< HEAD
  @ApiProperty()
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  @Transform(user => user.id)
  @Type(() => User)
  user: User;
=======
    @Exclude()
    @UpdateDateColumn()
    updated_at: Date;
>>>>>>> Added Comments module, controller, service and dtos. Implemented get (getAll), post (create), delete and update requests. Only logged in users can make requests and only author of the comment can update or delete it.

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
