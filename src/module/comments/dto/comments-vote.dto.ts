import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { CommentsVoteKey } from '../enum/comments-vote-key.enum';

export class CommentsVoteDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(CommentsVoteKey)
  vote: CommentsVoteKey;
}
