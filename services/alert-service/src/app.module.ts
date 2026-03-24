import { Module } from '@nestjs/common';
import { AlertsModule } from './alerts/alerts.module';
import { KafkaModule } from './kafka/kafka.module';

@Module({
  imports: [AlertsModule, KafkaModule],
})
export class AppModule {}
