import { Injectable, NotFoundException } from '@nestjs/common';
import { ExceptionCodeName } from 'src/enum/exception-codes.enum';
import { getRepository } from 'typeorm';
import { RequestUserPayload } from '../auth/interface/request-user-payload.interface';
import { UserService } from '../user/user.service';
import { UnauthorizedException } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post as PostModel } from './posts.entity';
import { Comment } from '../comments/comments.entity';
import { CommentsService } from '../comments/comments.service';
import { CommentsVote } from '../comments/comments-vote.entity';

@Injectable()
export class PostsService {
  constructor(
    private userService: UserService,
    private commentsService: CommentsService,
  ) {}

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
    date && (post.created_at = date);
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
    const { title, content, date } = updatePostDto;
    post.title = title || post.title;
    post.content = content || post.content;
    post.created_at = date || post.created_at;

    return await getRepository(PostModel).save(post);
  }

  @Transactional()
  async getAll(): Promise<PostModel[]> {
    return getRepository(PostModel)
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .leftJoinAndSelect('post.comments', 'comments')
      .getMany();
  }

  @Transactional()
  async getOne(id: number): Promise<PostModel | undefined> {
    const post = await this.getById(id);
    if (!post) {
      throw new NotFoundException(ExceptionCodeName.POST_DOES_NOT_EXIST);
    }
    post.views++;
    return getRepository(PostModel).save(post);
  }

  @Transactional()
  async getComments(id: number): Promise<Comment[]> {
    return getRepository(Comment)
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.user', 'user')
      .where('comment.post_id = :id', { id })
      .getMany();
  }

  @Transactional()
  async delete(
    id: number,
    requestUserPayload: RequestUserPayload,
  ): Promise<void> {
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
    const deleteCommentsList = post.comments.map(comment => comment.id);
    await getRepository(CommentsVote)
      .createQueryBuilder()
      .delete()
      .from(CommentsVote)
      .where('comment_id IN (:...deleteCommentsList)', { deleteCommentsList })
      .execute();
    await getRepository(Comment).remove(post.comments);
    await getRepository(PostModel).remove(post);
  }

  @Transactional()
  async getOneById(id: number, user_id: number): Promise<PostModel> {
    const res = await getRepository(PostModel)
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.comments', 'comments')
      .where('post.id = :id', { id })
      .andWhere('post.user_id = :user_id', { user_id })
      .getOne();
    if (!res) {
      throw new NotFoundException(
        ExceptionCodeName.POST_DOES_NOT_EXIST_OR_YOU_DO_NOT_OWN_THIS_POST,
      );
    }
    return res;
  }

  @Transactional()
  async getById(id: number): Promise<PostModel> {
    const res = await getRepository(PostModel)
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .leftJoinAndSelect('post.comments', 'comments')
      .where('post.id = :id', { id })
      .getOne();
    if (!res) {
      throw new NotFoundException(ExceptionCodeName.POST_DOES_NOT_EXIST);
    }
    return res;
  }

  @Transactional()
  async getMostViewedPosts(): Promise<PostModel[]> {
    return getRepository(PostModel)
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .leftJoinAndSelect('post.comments', 'comments')
      .orderBy('post.views', 'DESC')
      .take(5)
      .getMany();
  }
}
