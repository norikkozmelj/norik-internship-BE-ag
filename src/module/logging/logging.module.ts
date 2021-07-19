import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { ElasticsearchTransport } from 'winston-elasticsearch';
import { ConfigModule } from '@nestjs/config';
import elasticsearchTemplate from './elasticsearch.template';
import { EsFormat } from './format/es.format';
import { ConfigService } from '../config/config.service';

@Module({
  imports: [
    WinstonModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transports: [
          new ElasticsearchTransport({
            clientOpts: {
              node: configService.get('ELK_ELASTIC_HOST'),
            },
            indexPrefix: configService.get('ELK_INDEX_PREFIX'),
            mappingTemplate: elasticsearchTemplate,
            ensureMappingTemplate: true,
            format: new EsFormat(),
            transformer: ({ message, level, timestamp, meta }) => {
              return { message, level, timestamp, ...meta };
            },
          }),
        ],
      }),
    }),
  ],
})
export class LoggingModule {}
