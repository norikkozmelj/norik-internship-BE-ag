import { ApiProperty } from '@nestjs/swagger';
<<<<<<< HEAD
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCommentDto {
=======
import { IsDate, isNotEmpty, IsNotEmpty, IsNumber, IsPositive, isString, IsString } from 'class-validator';

export class CreateCommentDto{
  
>>>>>>> Added get (getMyPosts, getMyCommets) requests in UserModule controller
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty()
<<<<<<< HEAD
  @IsOptional()
  @IsDate()
  date?: Date;
}
=======
  @IsNotEmpty()
  @IsDate()
  date: Date;
} 
>>>>>>> Added get (getMyPosts, getMyCommets) requests in UserModule controller
