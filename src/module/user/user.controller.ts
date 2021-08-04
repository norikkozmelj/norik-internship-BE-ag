import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { User } from './user.entity';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RoleGuard } from '../auth/guard/role.guard';
import { Roles } from '../../decorator/roles.decorator';
import {
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ResponseInterceptor } from '../../interceptor/response.interceptor';
import { GetAllUsersDocumentation } from './decorator/get-all-users-documentation.decorator';
import { GetUserDocumentation } from './decorator/get-user-documentation.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { PutUserDocumentation } from './decorator/put-user-documentation.decorator';
import { DeleteUserDocumentation } from './decorator/delete-user-documentation.decorator';
import { UserRoleKey } from './enum/user-role-key.enum';
import { ExceptionCodeName } from '../../enum/exception-codes.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { PostUserDocumentation } from './decorator/post-user-documentation.decorator';
import { Post as PostModel } from '../posts/posts.entity';
import { Comment } from '../comments/comments.entity';
import { GetUser } from 'src/decorator/user.decorator';
import { RequestUserPayload } from '../auth/interface/request-user-payload.interface';

@ApiTags('user')
@Controller('user')
@UseInterceptors(ResponseInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOkResponse({
    description: 'List of your posts',
    type: [PostModel],
  })
  @ApiUnauthorizedResponse({
    description: 'User not logged in',
  })
  @UseGuards(JwtAuthGuard)
  @Get('posts')
  async getMyPosts(
    @GetUser() requestUserPayload: RequestUserPayload,
  ): Promise<PostModel[]> {
    return this.userService.getMyPosts(requestUserPayload);
  }

  @ApiOkResponse({
    description: 'List of your comments',
    type: [Comment],
  })
  @ApiUnauthorizedResponse({
    description: 'User not logged in',
  })
  @UseGuards(JwtAuthGuard)
  @Get('comments')
  async getMyComments(
    @GetUser() requestUserPayload: RequestUserPayload,
  ): Promise<Comment[]> {
    return this.userService.getMyComments(requestUserPayload);
  }

  @PostUserDocumentation()
  @Roles(UserRoleKey.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.userService.create(createUserDto);
  }

  @GetAllUsersDocumentation()
  @Roles(UserRoleKey.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get()
  async getAll(): Promise<User[]> {
    return this.userService.getMany({});
  }

  @GetUserDocumentation()
  @Roles(UserRoleKey.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get(':id')
  async getOneAsAdmin(@Param('id', ParseIntPipe) id: number): Promise<User> {
    const user = await this.userService.getOne({
      where: {
        id,
      },
    });
    if (!user) {
      throw new NotFoundException(ExceptionCodeName.USER_NOT_FOUND);
    }

    return user;
  }

  @PutUserDocumentation()
  @Roles(UserRoleKey.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Put(':id')
  async updateAsAdmin(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return await this.userService.update(id, updateUserDto);
  }

  @DeleteUserDocumentation()
  @Roles(UserRoleKey.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Delete(':id')
  async deleteUserAsAdmin(@Param('id') id: number): Promise<void> {
    return this.userService.delete(id);
  }
}
