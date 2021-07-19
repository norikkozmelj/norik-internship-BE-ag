import {
  Controller,
  Post,
  UseGuards,
  Body,
  UseInterceptors,
} from '@nestjs/common';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { AuthService } from './auth.service';
import { GetUser } from '../../decorator/user.decorator';
import { User } from '../user/user.entity';
import { AccessToken } from '../encryption/interface/access-token.interface';
import { ApiTags } from '@nestjs/swagger';
import { ResponseInterceptor } from '../../interceptor/response.interceptor';
import { CreateUserDto } from '../user/dto/create-user.dto';

@ApiTags('auth')
@Controller('auth')
@UseInterceptors(ResponseInterceptor)
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signIn(@GetUser() user: User): Promise<AccessToken> {
    return this.authService.getAccessToken(user);
  }

  @Post('signup')
  async signUp(
    @Body() userCredentialsDto: CreateUserDto,
  ): Promise<AccessToken> {
    return this.authService.signUp(userCredentialsDto);
  }
}
