import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs';

// KafkaService manages the connection to the Kafka broker and provides a method to publish messages to topics
@Injectable()
export class KafkaService implements OnModuleInit {
  private readonly logger = new Logger(KafkaService.name);
  private producer: Producer;

  // Kafka client configuration — clientId identifies this service, brokers is the Kafka cluster address (from env or default)
  private kafka = new Kafka({
    clientId: 'ingest-service',
    brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
  });

  async onModuleInit() {
    this.producer = this.kafka.producer();
    await this.producer.connect();
    this.logger.log('Kafka producer connected');
  }

  // Method to publish a message to a specific Kafka topic
  async publish(topic: string, message: any): Promise<void> {
    await this.producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
    this.logger.log(`Published to topic: ${topic}`);
  }
}
