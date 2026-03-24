import { Module } from '@nestjs/common';
import { KafkaConsumerService } from './kafka.consumer';
import { SearchModule } from '../search/search.module';

@Module({
  imports: [SearchModule],
  providers: [KafkaConsumerService],
})
export class KafkaModule {}
