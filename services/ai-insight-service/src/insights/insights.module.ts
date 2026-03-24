import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { InsightsService } from './insights.service';
import { InsightGateway } from './insight.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        node: config.get('ES_NODE', 'http://localhost:9200'),
      }),
    }),
    ScheduleModule.forRoot(),
  ],
  providers: [InsightsService, InsightGateway],
})
export class InsightsModule {}
