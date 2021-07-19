import { HttpService, Injectable } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { User } from '../src/module/user/user.entity';
import { SeedInclude } from './interface/seed-include.interface';
import { ConfigService } from '../src/module/config/config.service';
import { UserService } from '../src/module/user/user.service';
import { UserRoleKey } from '../src/module/user/enum/user-role-key.enum';
import { UpdateUserDto } from '../src/module/user/dto/update-user.dto';

@Injectable()
export class SeedService {
  seedInclude: SeedInclude = {
    adminUser: false,
    physicalActivityLevel: false,
    foodLifestyle: false,
    normalUser: false,
  };

  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
    private userService: UserService,
  ) {
    const seedingInclude = this.configService
      .get<string>('SEEDING_INCLUDE')
      .split(';');
    this.seedInclude.adminUser = seedingInclude.includes('adminUser');
    this.seedInclude.normalUser = seedingInclude.includes('normalUser');
    this.seedInclude.physicalActivityLevel = seedingInclude.includes(
      'physicalActivityLevel',
    );
    this.seedInclude.foodLifestyle = seedingInclude.includes('foodLifestyle');
  }

  @Transactional()
  async seed(): Promise<void> {
    /***** SUPER ADMIN USER *****/
    let adminUser: User | undefined;
    if (this.seedInclude.adminUser) {
      [adminUser] = await Promise.all([
        this.userService.create({
          email: 'info@norik.com',
          password: 'NorikApp2021!',
          role: UserRoleKey.ADMIN,
        }),
      ]);

      const updateUser = new UpdateUserDto();
      updateUser.first_name = 'Norik';
      updateUser.last_name = 'Admin';

      const updateUserAsAdmin = new UpdateUserDto();
      updateUserAsAdmin.role = UserRoleKey.ADMIN;

      await Promise.all([
        this.userService.update(adminUser.id, updateUserAsAdmin),
        this.userService.update(adminUser.id, updateUser),
      ]);
    }
    /***** SUPER ADMIN USER END *****/

    /***** ADMIN USERS *****/
    let normalUser1: User | undefined,
      normalUser2: User | undefined,
      normalUser3: User | undefined;
    if (this.seedInclude.normalUser) {
      [normalUser1, normalUser2, normalUser3] = await Promise.all([
        this.userService.create({
          email: 'luka.zlatecan@norik.com',
          password: 'NorikApp2021!',
          role: UserRoleKey.ADMIN,
        }),
        this.userService.create({
          email: 'martin.kozmelj@norik.com',
          password: 'NorikApp2021!',
          role: UserRoleKey.ADMIN,
        }),
        this.userService.create({
          email: 'jaka.purg@norik.com',
          password: 'NorikApp2021!',
          role: UserRoleKey.ADMIN,
        }),
      ]);

      const updateUser1 = new UpdateUserDto();
      updateUser1.first_name = 'Luka';
      updateUser1.last_name = 'Zlatečan';

      const updateUser2 = new UpdateUserDto();
      updateUser2.first_name = 'Martin';
      updateUser2.last_name = 'Kozmelj';

      const updateUser3 = new UpdateUserDto();
      updateUser3.first_name = 'Jaka';
      updateUser3.last_name = 'Purg';

      await Promise.all([
        this.userService.update(normalUser1.id, updateUser1),
        this.userService.update(normalUser2.id, updateUser2),
        this.userService.update(normalUser3.id, updateUser3),
      ]);
    }
    /***** ADMIN USERS END *****/
  }
}
