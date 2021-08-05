import { Injectable, NotFoundException } from '@nestjs/common';
import { ExceptionCodeName } from 'src/enum/exception-codes.enum';
import { getRepository } from 'typeorm';
import { RequestUserPayload } from '../auth/interface/request-user-payload.interface';
import { UserService } from '../user/user.service';
import { UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { Comment } from './comments.entity';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { PostsService } from '../posts/posts.service';
import { Inject, forwardRef } from '@nestjs/common';
import { CommentsVote } from './comments-vote.entity';
import { CommentsVoteDto } from './dto/comments-vote.dto';

@Injectable()
export class CommentsService {
  constructor(
    @Inject(forwardRef(() => PostsService))
    private postsService: PostsService,
    private userService: UserService,
  ) {}

  @Transactional()
  async vote(
    id: number,
    requestUserPayload: RequestUserPayload,
    commentsVoteDto: CommentsVoteDto,
  ): Promise<CommentsVote | void> {
    const user = await this.userService.getOne({
      where: {
        id: requestUserPayload.id,
      },
    });
    if (!user) {
      throw new UnauthorizedException(ExceptionCodeName.INVALID_CREDENTIALS);
    }
    const comment = await this.getOne(id);
    if (comment.user.id == user.id) {
      throw new ForbiddenException(
        ExceptionCodeName.YOU_CAN_NOT_RATE_YOUR_COMMENT,
      );
    }
    const index = comment.commentsVotes
      .map(vote => vote.user.id)
      .indexOf(user.id);
    if (index > -1) {
      if (
        comment.commentsVotes[index].commentsVoteKey == commentsVoteDto.vote
      ) {
        await getRepository(CommentsVote).remove(comment.commentsVotes[index]);
      } else {
        comment.commentsVotes[index].commentsVoteKey = commentsVoteDto.vote;
        return await getRepository(CommentsVote).save(
          comment.commentsVotes[index],
        );
      }
    } else {
      const commentsVote = new CommentsVote();
      commentsVote.user = user;
      commentsVote.commentsVoteKey = commentsVoteDto.vote;
      commentsVote.comment = comment;
      return await getRepository(CommentsVote).save(commentsVote);
    }
  }

  @Transactional()
  async create(
    id: number,
    createCommentDto: CreateCommentDto,
    requestUserPayload: RequestUserPayload,
  ): Promise<Comment> {
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
  async getAll(): Promise<Comment[]> {
    return getRepository(Comment)
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.user', 'user')
      .leftJoinAndSelect('comment.post', 'post')
      .leftJoinAndSelect('comment.commentsVotes', 'commentsVotes')
      .leftJoinAndSelect('commentsVotes.user', 'commentsVotesUser')
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
    const comment = await this.getOneById(id, user_id);
    await getRepository(CommentsVote).remove(comment.commentsVotes);
    await getRepository(Comment).remove(comment);
  }

  @Transactional()
  async update(
    id: number,
    requestUserPayload: RequestUserPayload,
    updateCommentDto: UpdateCommentDto,
  ): Promise<Comment> {
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
  async getOneById(id: number, user_id: number): Promise<Comment> {
    const res = await getRepository(Comment)
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.commentsVotes', 'commentsVotes')
      .where('comment.id = :id', { id })
      .andWhere('comment.user_id = :user_id', { user_id })
      .getOne();
    if (!res) {
      throw new NotFoundException(
        ExceptionCodeName.COMMENT_DOES_NOT_EXIST_OR_YOU_DO_NOT_OWN_THIS_COMMENT,
      );
    }
    return res;
  }

  @Transactional()
  async getOne(id: number): Promise<Comment> {
    const res = await getRepository(Comment)
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.user', 'user')
      .leftJoinAndSelect('comment.commentsVotes', 'commentsVotes')
      .leftJoinAndSelect('commentsVotes.user', 'commentsVotesUser')
      .where('comment.id = :id', { id })
      .getOne();
    if (!res) {
      throw new NotFoundException(
        ExceptionCodeName.COMMENT_DOES_NOT_EXIST_OR_YOU_DO_NOT_OWN_THIS_COMMENT,
      );
    }
    return res;
  }
}
