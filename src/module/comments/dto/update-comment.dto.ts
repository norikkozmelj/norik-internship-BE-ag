import { ApiProperty } from '@nestjs/swagger';
<<<<<<< HEAD
import { IsDate, IsOptional, IsString } from 'class-validator';

export class UpdateCommentDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty()
  @IsOptional()
  @IsDate()
  date?: Date;
}
=======
import { IsDate, IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class UpdateCommentDto{
  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty()
  @IsDate()
  date: Date;
} 
>>>>>>> Added get (getMyPosts, getMyCommets) requests in UserModule controller
