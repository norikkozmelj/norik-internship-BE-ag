import {
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
  
  @Entity()
  export class PostModel {
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


    @ApiProperty()
    @Column()
    date: Date;

    @Exclude()
    @CreateDateColumn()
    created_at: Date;

    @Exclude()
    @CreateDateColumn()
    updated_at: Date;

  }
  