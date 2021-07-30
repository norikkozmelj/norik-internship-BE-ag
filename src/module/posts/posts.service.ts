import { Injectable, NotFoundException, Post } from '@nestjs/common';
import { ExceptionCodeName } from 'src/enum/exception-codes.enum';
import { getRepository } from 'typeorm';
import { RequestUserPayload } from '../auth/interface/request-user-payload.interface';
import { UserService } from '../user/user.service';
import { UnauthorizedException } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostModel } from './posts.entity';


@Injectable()
export class PostsService {
  constructor(
    private userService: UserService
  ){}

  @Transactional()
  async create(
      createPostDto: CreatePostDto,
      requestUserPayload: RequestUserPayload,
  ): Promise<PostModel> {
    const user = await this.userService.getOne({
      where: {
        id: requestUserPayload.id,
      },
    });
    if (!user) {
      throw new UnauthorizedException(ExceptionCodeName.INVALID_CREDENTIALS);
    }
    
    const { title, content, date } = createPostDto;

    const post = new PostModel();
    post.title = title;
    post.content = content;
    post.user = user;
    post.date = date;
    return getRepository(PostModel).save(post);
  }
  
  
  @Transactional()
  async update(
    id: number, 
    requestUserPayload: RequestUserPayload,
    updatePostDto: UpdatePostDto,
  ): Promise<PostModel> {
    const user = await this.userService.getOne({
      where: {
        id: requestUserPayload.id,
      },
    });
    if (!user) {
      throw new UnauthorizedException(ExceptionCodeName.INVALID_CREDENTIALS);
    }
    const user_id = user.id;
    const post = await this.getOneById(id, user_id);
    if (!post) {
      throw new NotFoundException(ExceptionCodeName.YOU_CAN_NOT_UPDATE_THIS_POST);
    }
    
    const { title, content, date } = updatePostDto;
    const newPost = {...post};
    newPost.title = (title) ? title : newPost.title;
    newPost.content = (content) ? content : newPost.content;
    newPost.date = (date) ? date : newPost.date;

    return await getRepository(PostModel).save(newPost);
  }
  
  
  @Transactional()
  async getAll(): Promise<PostModel[]> {
    return getRepository(PostModel).createQueryBuilder('post_model')
    .leftJoinAndSelect("post_model.user", "user")
    .getMany();
  }

  
  @Transactional()
  async delete(id: number, requestUserPayload: RequestUserPayload): Promise<void> {
    const user = await this.userService.getOne({
      where: {
        id: requestUserPayload.id,
      },
    });
    if (!user) {
      throw new UnauthorizedException(ExceptionCodeName.INVALID_CREDENTIALS);
    }
    const user_id = user.id;
    const post = await this.getOneById(id, user_id);
    if (!post) {
      throw new NotFoundException(ExceptionCodeName.YOU_CAN_NOT_DELETE_THIS_POST);
    }
        
    getRepository(PostModel)
      .createQueryBuilder()
      .delete()
      .where('id = :id', { id })
      .andWhere('user_id = :user_id', {user_id})
      .execute();
  }


  @Transactional()
  async getOneById(id: number, user_id: number): Promise<PostModel> {
    const res = await getRepository(PostModel)
      .createQueryBuilder('post_model')
      .where('id = :id', { id })
      .andWhere('user_id = :user_id', {user_id})
      .getOne();
    if (!res) {
      throw new NotFoundException(ExceptionCodeName.POST_DOES_NOT_EXIST_OR_YOU_DO_NOT_OWN_THIS_POST);
    }
    return res;
  }
  
}
