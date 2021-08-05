import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { CommentsVoteKey } from '../enum/comments-vote-key.enum';

export class CommentsVoteDto {
  @ApiProperty({enum:['LIKE','DISLIKE'],example: '"vote": "DISLIKE"'})
  @IsNotEmpty()
  @IsEnum(CommentsVoteKey)
  vote: CommentsVoteKey;
}
