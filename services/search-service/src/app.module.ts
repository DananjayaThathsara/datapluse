import { Module } from '@nestjs/common';
import { KafkaModule } from './kafka/kafka.module';
import { SearchModule } from './search/search.module';

@Module({
  imports: [KafkaModule, SearchModule],
})
export class AppModule {}
