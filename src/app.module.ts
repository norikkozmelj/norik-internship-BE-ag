import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './module/auth/auth.module';
import { UserModule } from './module/user/user.module';
import { EncryptionModule } from './module/encryption/encryption.module';
import { LoggingModule } from './module/logging/logging.module';
import { PostsModule } from './module/posts/posts.module';
import { AllExceptionsFilter } from './filter/all-exceptions.filter';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigService } from './module/config/config.service';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { CommentsModule } from './module/comments/comments.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('TYPEORM_HOST'),
        port: +configService.get<number>('TYPEORM_PORT'),
        username: configService.get<string>('TYPEORM_USERNAME'),
        password: configService.get<string>('TYPEORM_PASSWORD'),
        database: configService.get<string>('TYPEORM_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/database/migration/*{.ts,.js}'],
        migrationsRun:
          configService.get<string>('TYPEORM_MIGRATIONS_RUN') === 'true',
        synchronize:
          configService.get<string>('TYPEORM_SYNCHRONIZE') === 'true',
        logging: configService.get<string>('TYPEORM_LOGGING') === 'true',
        extra: {
          max: +configService.get<number>('TYPEORM_MAX_CONNECTION_POOL_SIZE'),
        },
      }),
      inject: [ConfigService],
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ttl: configService.get<number>('THROTTLE_TTL'),
        limit: configService.get<number>('THROTTLE_LIMIT'),
      }),
    }),
    AuthModule,
    UserModule,
    EncryptionModule,
    LoggingModule,
    PostsModule,
    CommentsModule
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}
