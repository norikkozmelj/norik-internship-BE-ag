import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({example: "Dončić is the best player in the world RN!"})
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({example: "Slovenia plays well, I think they can win a medal!"})
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiPropertyOptional({example: "2021-08-15T14:00:00.000Z"})
  @IsOptional()
  @IsDate()
  date?: Date;
}
