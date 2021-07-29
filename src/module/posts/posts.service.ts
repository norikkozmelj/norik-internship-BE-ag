import { Injectable, NotFoundException } from '@nestjs/common';
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

  /*async create(
    createPostDto: CreatePostDto,
  ): Promise<PostModel> {
    
    const { title, content, date } = createPostDto;

    const post = new PostModel();
    post.title = title;
    post.content = content;
    post.date = date;
    //return getRepository(Plant).save(plant);
    return post;
  }*/
  //@Transactional()
  
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
  
  /*
  @Transactional()
  async update(id: number, updatePlantDto: UpdatePlantDto): Promise<Plant> {
    const { name, info, image_path, days_water, care } = updatePlantDto;
    const plant = await this.getOneById(id);
    plant.name = name;
    plant.care = care;
    plant.info = info;
    plant.image_path = image_path;
    plant.days_water = days_water;
    return getRepository(Plant).save(plant);
  }
  */
  
  
  @Transactional()
  async getAll(): Promise<PostModel[]> {
    return getRepository(PostModel).createQueryBuilder('post_model').getMany();
  }

  /*
  @Transactional()
  async getOneById(id: number): Promise<Plant> {
    const res = await getRepository(Plant)
      .createQueryBuilder('plant')
      .where('plant.id = :id', { id })
      .getOne();
    if (!res) {
      throw new NotFoundException(ExceptionCodeName.INVALID_PLANT_ID);
    }
    return res;
  }

  @Transactional()
  async delete(id: number): Promise<void> {
    getRepository(Plant)
      .createQueryBuilder()
      .delete()
      .where('id = :id', { id })
      .execute();
  }
  */
}
