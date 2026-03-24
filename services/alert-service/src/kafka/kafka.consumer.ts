import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Kafka } from 'kafkajs';
import { AlertsService } from '../alerts/alerts.service';

@Injectable()
export class KafkaConsumer implements OnModuleInit {
  private readonly logger = new Logger(KafkaConsumer.name);
  private kafka = new Kafka({
    brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
  });
  private consumer = this.kafka.consumer({ groupId: 'alert-group' });

  constructor(private alertsService: AlertsService) {}

  async onModuleInit() {
    await this.consumer.connect();
    await this.consumer.subscribe({
      topic: 'events.created',
      fromBeginning: false,
    });

    await this.consumer.run({
      eachMessage: async ({ message }) => {
        const event = JSON.parse(message.value?.toString() ?? '{}');
        this.logger.log(`Received event: ${event.id}`);
        this.alertsService.processEvent(event);
      },
    });

    this.logger.log('Kafka consumer connected — listening to events.created');
  }
}
