import {
  Controller,
  Body,
  Post,
  Get,
  Put,
  Param,
  Delete,
  UseGuards,
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
import { Comment } from './comments.entity';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentsVoteDto } from './dto/comments-vote.dto';
import { CommentsVote } from './comments-vote.entity';

@ApiTags('comments')
@ApiBearerAuth()
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @ApiCreatedResponse({
    description: 'The comment has been successfully posted.',
    type: Comment,
  })
  @ApiUnauthorizedResponse({
    description: 'User is not logged in',
  })
  @ApiBadRequestResponse({
    description: 'Invalid body',
  })
  @UseGuards(JwtAuthGuard)
  @Post(':id')
  async create(
    @Param('id') id: number,
    @Body() createCommentDto: CreateCommentDto,
    @GetUser() requestUserPayload: RequestUserPayload,
  ): Promise<Comment> {
    return this.commentsService.create(
      id,
      createCommentDto,
      requestUserPayload,
    );
  }

  @ApiOkResponse({
    description: 'List of all comments.',
    type: [Comment],
  })
  @ApiUnauthorizedResponse({
    description: 'User is not logged in',
  })
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll(): Promise<Comment[]> {
    return this.commentsService.getAll();
  }

  @ApiOkResponse({
    description: 'Comment deleted.',
  })
  @ApiUnauthorizedResponse({
    description: 'User is not logged in',
  })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(
    @Param('id') id: number,
    @GetUser() requestUserPayload: RequestUserPayload,
  ): Promise<void> {
    return this.commentsService.delete(id, requestUserPayload);
  }

  @ApiCreatedResponse({
    description: 'The comment has been successfully posted.',
    type: Comment,
  })
  @ApiUnauthorizedResponse({
    description: 'User is not logged in',
  })
  @UseGuards(JwtAuthGuard)
  @Put(':id/vote')
  async like(
    @Param('id') id: number,
    @GetUser() requestUserPayload: RequestUserPayload,
    @Body() commentsVoteDto: CommentsVoteDto,
  ): Promise<CommentsVote | void> {
    return this.commentsService.vote(id, requestUserPayload, commentsVoteDto);
  }

  @ApiOkResponse({
    description: 'Comment updated.',
    type: Comment,
  })
  @ApiUnauthorizedResponse({
    description: 'User is not logged in',
  })
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: number,
    @GetUser() requestUserPayload: RequestUserPayload,
    @Body() updateCommentDto: UpdateCommentDto,
  ): Promise<Comment> {
    return this.commentsService.update(
      id,
      requestUserPayload,
      updateCommentDto,
    );
  }
}
