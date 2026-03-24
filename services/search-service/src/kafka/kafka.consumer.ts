import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Kafka } from 'kafkajs';
import { SearchService } from '../search/search.service';

@Injectable()
export class KafkaConsumerService implements OnModuleInit {
  private readonly logger = new Logger(KafkaConsumerService.name);
  private kafka = new Kafka({
    clientId: 'search-service',
    brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
  });

  constructor(private searchService: SearchService) {}

  async onModuleInit() {
    // groupId: 'search-group' — Kafka tracks what THIS service has read
    // Different from alert-service's 'alert-group' — both get all messages
    const consumer = this.kafka.consumer({ groupId: 'search-group' });
    await consumer.connect();

    // Subscribe to the topic ingest-service publishes to
    // fromBeginning: false — only read NEW messages, not old ones from history
    await consumer.subscribe({ topic: 'events.created', fromBeginning: false });

    // Run a loop — for every new message, run this function
    await consumer.run({
      eachMessage: async ({ message }) => {
        // message.value is a Buffer — convert to string then parse JSON
        const event = JSON.parse(message.value?.toString() ?? '{}');
        await this.searchService.indexEvent(event);
        this.logger.log(`Indexed: ${event.id}`);
      },
    });
  }
}