import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsOptional, IsString } from 'class-validator';

export class UpdatePostDto {
  @ApiPropertyOptional({ example: 'Dončić is the Beast' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ example: 'Slovenia will win a medal' })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({ example: '2021-08-15T18:00:00.000Z' })
  @IsOptional()
  @IsDate()
  date?: Date;
}
