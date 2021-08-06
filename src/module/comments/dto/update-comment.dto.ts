import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsOptional, IsString } from 'class-validator';

export class UpdateCommentDto {
  @ApiPropertyOptional({ example: 'I think you are right!' })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({ example: '2021-08-15T18:00:00.000Z' })
  @IsOptional()
  @IsDate()
  date?: Date;
}
