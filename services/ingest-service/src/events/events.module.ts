import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './event.entity';
import { KafkaModule } from '../kafka/kafka.module';

@Module({
  imports: [TypeOrmModule.forFeature([Event]), KafkaModule],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
