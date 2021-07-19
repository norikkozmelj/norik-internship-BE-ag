import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { UserCredentialsDto } from './dto/user-credentials.dto';
import { EncryptionService } from '../encryption/encryption.service';
import { User } from '../user/user.entity';
import { AccessToken } from '../encryption/interface/access-token.interface';
import { ExceptionCodeName } from '../../enum/exception-codes.enum';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserRoleKey } from '../user/enum/user-role-key.enum';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private encryptionService: EncryptionService,
  ) {}

  @Transactional()
  async getAccessToken(user: User): Promise<AccessToken> {
    const token = await this.encryptionService.generateAccessToken(
      user.id,
      user.role,
    );
    return token;
  }

  @Transactional()
  async validateUserLocal(
    userCredentialsDto: UserCredentialsDto,
  ): Promise<User> {
    const user = await this.userService.getOne({
      where: {
        email: userCredentialsDto.email,
      },
    });
    if (!user) {
      throw new NotFoundException(ExceptionCodeName.USER_NOT_FOUND);
    }

    const isValidPassword =
      user.password &&
      (await this.encryptionService.comparePassword(
        userCredentialsDto.password,
        user.password,
      ));

    if (!isValidPassword) {
      throw new UnauthorizedException(ExceptionCodeName.INVALID_CREDENTIALS);
    }

    return user;
  }

  @Transactional()
  async signUp(createUserDto: CreateUserDto): Promise<AccessToken> {
    const { password } = createUserDto;
    createUserDto.password =
      password && (await this.encryptionService.hashPassword(password));
    createUserDto.role = UserRoleKey.USER;
    const user = await this.userService.create(createUserDto);
    return this.encryptionService.generateAccessToken(user.id, user.role);
  }
}
