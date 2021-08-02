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
<<<<<<< HEAD
<<<<<<< HEAD
import { Comment } from '../comments/comments.entity';
=======

>>>>>>> Added Comments module, controller, service and dtos. Implemented get (getAll), post (create), delete and update requests. Only logged in users can make requests and only author of the comment can update or delete it.
=======
import { Comment } from '../comments/comments.entity';
>>>>>>> Created post and comment relation, updated comment post request, so you can post comment to a post. Implemented endpoint where you can get all comments from specific post

@Injectable()
export class PostsService {
  constructor(private userService: UserService) {}

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
    const post = {...await this.getOneById(id, user_id)};
    const { title, content, date } = updatePostDto;
    post.title = title || post.title;
    post.content = content || post.content;
<<<<<<< HEAD
    post.created_at = date || post.created_at;
=======
    post.date = date || post.date;
>>>>>>> Created post and comment relation, updated comment post request, so you can post comment to a post. Implemented endpoint where you can get all comments from specific post

    return await getRepository(PostModel).save(post);
  }

  @Transactional()
  async getAll(): Promise<PostModel[]> {
<<<<<<< HEAD
    return getRepository(PostModel)
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .leftJoinAndSelect('post.comments', 'comments')
      .getMany();
  }

  @Transactional()
  async getOne(id: number): Promise<PostModel | undefined> {
    return getRepository(PostModel)
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .leftJoinAndSelect('post.comments', 'comments')
      .where('post.id = :id', { id })
      .getOne();
  }

  @Transactional()
  async getComments(id: number): Promise<Comment[]> {
    return getRepository(Comment)
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.user', 'user')
      .where('comment.post_id = :id', { id })
      .getMany();
=======
    return getRepository(PostModel).createQueryBuilder('post_model')
    .leftJoinAndSelect("post_model.user", "user")
    .leftJoinAndSelect("post_model.comments", "comments")
    .getMany();
>>>>>>> Implemented get request for only one post with id, all get requests on post also return author and comments on the posts
  }

<<<<<<< HEAD
=======
  @Transactional()
  async getOne(
    id: number
  ): Promise<PostModel | undefined> {
    return getRepository(PostModel)
    .createQueryBuilder('post_model')
    .leftJoinAndSelect('post_model.user', 'user')
    .leftJoinAndSelect('post_model.comments', 'comments')
    .where('post_model.id = :id', {id})
    .getOne();
  }

  @Transactional()
  async getComments(
    id: number,
  ): Promise<Comment[]> {
    return getRepository(Comment)
    .createQueryBuilder('comment')
    .leftJoinAndSelect('comment.user', 'user')
    .where('comment.postId = :id', {id})
    .getMany();
  }
  
>>>>>>> Created post and comment relation, updated comment post request, so you can post comment to a post. Implemented endpoint where you can get all comments from specific post
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
<<<<<<< HEAD
    const post = await this.getOneById(id, user_id);
    await getRepository(Comment).remove(post.comments);
    await getRepository(PostModel).remove(post);
=======
    await this.getOneById(id, user_id);
    getRepository(PostModel)
      .createQueryBuilder()
      .delete()
      .where('id = :id', { id })
      .andWhere('user_id = :user_id', {user_id})
      .execute();
>>>>>>> Added Comments module, controller, service and dtos. Implemented get (getAll), post (create), delete and update requests. Only logged in users can make requests and only author of the comment can update or delete it.
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
<<<<<<< HEAD
=======

  @Transactional()
  async getById(id: number): Promise<PostModel> {
    const res = await getRepository(PostModel)
      .createQueryBuilder('post_model')
      .where('id = :id', { id })
      .getOne();
    if (!res) {
      throw new NotFoundException(ExceptionCodeName.POST_DOES_NOT_EXIST);
    }
    return res;
  }
  
>>>>>>> Created post and comment relation, updated comment post request, so you can post comment to a post. Implemented endpoint where you can get all comments from specific post
}
