import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ example: 'I think you are wrong!' })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiPropertyOptional({ example: '2021-08-15T18:00:00.000Z' })
  @IsOptional()
  @IsDate()
  date?: Date;
}
