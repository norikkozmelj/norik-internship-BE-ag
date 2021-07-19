import { HttpModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../src/module/auth/auth.module';
import { UserModule } from '../src/module/user/user.module';
import { EncryptionModule } from '../src/module/encryption/encryption.module';
import { LoggingModule } from '../src/module/logging/logging.module';
import { ConfigService } from '../src/module/config/config.service';
import { SeedService } from './seed.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('TYPEORM_HOST'),
        port: +configService.get<number>('TYPEORM_PORT'),
        username: configService.get('TYPEORM_USERNAME'),
        password: configService.get('TYPEORM_PASSWORD'),
        database: configService.get('TYPEORM_DATABASE'),
        entities: [__dirname + '/../src/**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/../src/database/migration/*{.ts,.js}'],
        migrationsRun: configService.get('TYPEORM_MIGRATIONS_RUN') === 'true',
        synchronize: configService.get('TYPEORM_SYNCHRONIZE') === 'true',
        logging: configService.get('TYPEORM_LOGGING') === 'true',
        extra: {
          max: +configService.get<number>('TYPEORM_MAX_CONNECTION_POOL_SIZE'),
        },
      }),
      inject: [ConfigService],
    }),
    HttpModule,
    AuthModule,
    UserModule,
    EncryptionModule,
    LoggingModule,
  ],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
