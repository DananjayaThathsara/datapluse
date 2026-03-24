import { Module } from '@nestjs/common';
import { AlertsModule } from '../alerts/alerts.module';
import { KafkaConsumer } from './kafka.consumer';

@Module({
  imports: [AlertsModule],
  providers: [KafkaConsumer],
})
export class KafkaModule {}
