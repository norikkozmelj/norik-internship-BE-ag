import { Injectable, NotFoundException, Post } from '@nestjs/common';
import { ExceptionCodeName } from 'src/enum/exception-codes.enum';
import { getRepository } from 'typeorm';
import { RequestUserPayload } from '../auth/interface/request-user-payload.interface';
import { UserService } from '../user/user.service';
import { UnauthorizedException } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { Comment } from './comments.entity';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Post as PostModel} from '../posts/posts.entity';
import { PostsService } from '../posts/posts.service';

@Injectable()
export class CommentsService {
  constructor(
    private postsService: PostsService,
    private userService: UserService,
  ){}

  @Transactional()
  async create(
    id: number,
    createCommentDto: CreateCommentDto,
    requestUserPayload: RequestUserPayload,
  ): Promise<Comment>{
    const user = await this.userService.getOne({
      where: {
        id: requestUserPayload.id,
      },
    });
    if (!user) {
      throw new UnauthorizedException(ExceptionCodeName.INVALID_CREDENTIALS);
    }
    
    const { content, date } = createCommentDto;

    const comment = new Comment();
    comment.content = content;
    comment.user = user;
    date && (comment.created_at = date);
    const post = await this.postsService.getById(id);
    comment.post = post;
    return await getRepository(Comment).save(comment);
  }
  
  @Transactional()
  async getAll(): Promise<Comment[]>{
    return getRepository(Comment).
    createQueryBuilder('comment').
    leftJoinAndSelect('comment.user', 'user').
    leftJoinAndSelect('comment.post', 'post').
    getMany();
  }
  
  @Transactional()
  async delete(
    id: number,
    requestUserPayload: RequestUserPayload,
  ): Promise<void>{
    const user = await this.userService.getOne({
      where: {
        id: requestUserPayload.id,
      },
    });
    if (!user) {
      throw new UnauthorizedException(ExceptionCodeName.INVALID_CREDENTIALS);
    }
    const user_id = user.id;
    const comment = await this.getOneById(id, user_id);
    getRepository(Comment).remove(comment);
  }

  @Transactional()
  async update(
    id: number,
    requestUserPayload: RequestUserPayload,
    updateCommentDto: UpdateCommentDto,
  ): Promise<Comment>{
    const user = await this.userService.getOne({
      where: {
        id: requestUserPayload.id,
      },
    });
    if (!user) {
      throw new UnauthorizedException(ExceptionCodeName.INVALID_CREDENTIALS);
    }
    const { content, date } = updateCommentDto;
    const comment = await this.getOneById(id, user.id);
    comment.content = content || comment.content;
    comment.created_at = date || comment.created_at;
    return getRepository(Comment).save(comment);
  }

  @Transactional()
  async getOneById(
    id: number,
    user_id: number
  ): Promise<Comment>{
    const res = await getRepository(Comment).
    createQueryBuilder('comment').
    where('id = :id', {id}).
    andWhere('user_id = :user_id', {user_id}).
    getOne();
    if (!res) {
      throw new NotFoundException(ExceptionCodeName.COMMENT_DOES_NOT_EXIST_OR_YOU_DO_NOT_OWN_THIS_COMMENT);
    }
    return res;
  }

}