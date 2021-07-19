import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as helmet from 'helmet';
import {
  initializeTransactionalContext,
  patchTypeORMRepositoryWithBaseRepository,
} from 'typeorm-transactional-cls-hooked';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from './module/config/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet()).enableCors();

  const options = new DocumentBuilder()
    .setTitle('Norik api')
    .setDescription('This is the backend part for Norik internship')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('doc', app, document);

  const port: number = +app.get(ConfigService).get<number>('GENERAL_PORT');
  await app.listen(port);
}
initializeTransactionalContext();
patchTypeORMRepositoryWithBaseRepository();
bootstrap();
