import { 
    Controller,
    Body, 
    Post,
    Get, 
    Put, 
    Param, 
    Delete,
    UseGuards
  } from '@nestjs/common';
  import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiTags,
    ApiUnauthorizedResponse,
  } from '@nestjs/swagger';
  import { GetUser } from 'src/decorator/user.decorator';
  import { RequestUserPayload } from '../auth/interface/request-user-payload.interface';
  import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
  import { Post as PostModel } from './posts.entity';
  import { PostsService } from './posts.service';
  import { CreatePostDto } from './dto/create-post.dto';
  import { UpdatePostDto } from './dto/update-post.dto';
  import { Comment } from '../comments/comments.entity';
    
  @ApiTags('posts')
  @ApiBearerAuth()
  @Controller('posts')
  export class PostsController {
    constructor(private readonly postsService: PostsService) {}
  
    @ApiOkResponse({
      description: 'List of all posts',
      type: [PostModel],
    })
    @ApiUnauthorizedResponse({
      description: 'User is not logged in',
    })
    @UseGuards(JwtAuthGuard)
    @Get()
    async getAll(): Promise<PostModel[]> {
      return this.postsService.getAll();
    }

    @ApiOkResponse({
      description: 'List of comments on this post',
      type: [PostModel],
    })
    @ApiUnauthorizedResponse({
      description: 'User is not logged in',
    })
    @UseGuards(JwtAuthGuard)
    @Get('comments/:id')
    async getComments(
      @Param('id') id:number,
    ): Promise<Comment[]> {
      return this.postsService.getComments(id);
    }
    
    @ApiCreatedResponse({
      description: 'Post was created',
      type: PostModel,
    })
    @ApiUnauthorizedResponse({
      description: 'User is not logged in',
    })
    @ApiBadRequestResponse({
      description: 'Invalid body',
    })
    @UseGuards(JwtAuthGuard)
    @Post()
    async create(
      @Body() createPostDto: CreatePostDto,
      @GetUser() requestUserPayload: RequestUserPayload,
    ): Promise<PostModel> {
      return this.postsService.create(createPostDto, requestUserPayload);
    }
    

    
    @ApiCreatedResponse({
      description: 'Post was updated',
      type: Post,
    })
    @ApiUnauthorizedResponse({
      description: 'User is not logged in',
    })
    @ApiBadRequestResponse({
      description: 'Invalid body',
    })
    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async update(
      @Param('id') id: number,
      @Body() updatePostDto: UpdatePostDto,
      @GetUser() requestUserPayload: RequestUserPayload,
    ): Promise<PostModel> {
      return this.postsService.update(id, requestUserPayload, updatePostDto);
    }
    
    
    @ApiOkResponse({
      description: 'Post was deleted',
    })
    @ApiUnauthorizedResponse({
      description: 'User is not logged in',
    })
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async delete(@Param('id') id: number,
          @GetUser() requestUserPayload: RequestUserPayload,
    ): Promise<void> {
      return this.postsService.delete(id, requestUserPayload);
    }
    
  }
  