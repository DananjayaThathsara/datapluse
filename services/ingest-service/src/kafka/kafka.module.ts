import { Module } from '@nestjs/common';
import { KafkaService } from './kafka.service';

@Module({
  providers: [KafkaService],
  exports: [KafkaService], // ← must export so other modules can use it
})
export class KafkaModule {}
