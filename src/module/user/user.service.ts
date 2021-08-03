import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { FindManyOptions, FindOneOptions, getRepository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { ExceptionCodeName } from '../../enum/exception-codes.enum';
import { EncryptionService } from '../encryption/encryption.service';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { UpdateUserDto } from './dto/update-user.dto';
import { RequestUserPayload } from '../auth/interface/request-user-payload.interface';
import { Post as PostModel } from '../posts/posts.entity';
import { Comment } from '../comments/comments.entity';

@Injectable()
export class UserService {
  constructor(private encryptionService: EncryptionService) {}

  @Transactional()
  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.getOne({
      where: {
        email: createUserDto.email,
      },
    });
    if (existingUser) {
      if ((existingUser.email = createUserDto.email)) {
        throw new ConflictException(ExceptionCodeName.USER_EMAIL_CONFLICT);
      }
    }
    const user = new User();
    user.email = createUserDto.email;
    user.password = await this.encryptionService.hashPassword(
      createUserDto.password,
    );
    user.role = createUserDto.role;
    return await getRepository(User).save(user);
  }

  @Transactional()
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    let user = await this.getOne({
      where: {
        id,
      },
    });
    if (!user) {
      throw new NotFoundException(ExceptionCodeName.USER_NOT_FOUND);
    }

    user.email =
      updateUserDto.email !== undefined ? updateUserDto.email : user.email;
    user.first_name =
      updateUserDto.first_name !== undefined
        ? updateUserDto.first_name
        : user.first_name;
    user.last_name =
      updateUserDto.last_name !== undefined
        ? updateUserDto.last_name
        : user.last_name;
    user.role = updateUserDto.role ? updateUserDto.role : user.role;

    user = await getRepository(User).save(user);

    return user;
  }

  @Transactional()
  async getMany(options: FindManyOptions<User> = {}): Promise<User[]> {
    return getRepository(User).find(options);
  }

  @Transactional()
  async getOne(options: FindOneOptions<User> = {}): Promise<User | undefined> {
    return getRepository(User).findOne(options);
  }

  @Transactional()
  async delete(id: number): Promise<void> {
    const user = await this.getOne({
      where: {
        id,
      },
    });
    if (!user) {
      throw new NotFoundException(ExceptionCodeName.USER_NOT_FOUND);
    }
    await getRepository(User).remove(user);
  }

  @Transactional()
  async getMyPosts(
    requestUserPayload: RequestUserPayload
  ): Promise<PostModel[]> {
    const user = await this.getOne({
      where: {
        id: requestUserPayload.id,
      },
    });
    if (!user) {
      throw new NotFoundException(ExceptionCodeName.USER_NOT_FOUND);
    }
    const user_id = user.id;
    return await getRepository(PostModel).
    createQueryBuilder('post').
    leftJoinAndSelect('post.comments','comments').
    where('post.user_id = :user_id', {user_id}).
    getMany();
  }

  @Transactional()
  async getMyComments(
    requestUserPayload: RequestUserPayload
  ): Promise<Comment[]> {
    const user = await this.getOne({
      where: {
        id: requestUserPayload.id,
      },
    });
    if (!user) {
      throw new NotFoundException(ExceptionCodeName.USER_NOT_FOUND);
    }
    const user_id = user.id;
    return await getRepository(Comment).
    createQueryBuilder('comment').
    leftJoinAndSelect('comment.post', 'post').
    where('comment.user_id = :user_id', {user_id}).
    getMany();
  }
}
