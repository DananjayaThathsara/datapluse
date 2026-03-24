import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './event.entity';
import { CreateEventDto } from './create-event.dto';
import { KafkaService } from '../kafka/kafka.service';

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  // Inject the Event repository to manage events in the database and KafkaService to publish messages to Kafka topics
  constructor(
    @InjectRepository(Event) private repo: Repository<Event>,
    private kafkaService: KafkaService,
  ) {}

  async create(dto: CreateEventDto): Promise<Event> {
    // Save to database — returns the saved event with generated ID and timestamps
    const event = await this.repo.save(this.repo.create(dto));
    this.logger.log(`Saved: ${event.id}`);

    // Publish to Kafka — sends a message to the 'events.created' topic with the event data
    await this.kafkaService.publish('events.created', event);
    return event;
  }

  async findAll(filters?: {
    type?: string;
    severity?: string;
    limit?: number;
  }) {
    // QueryBuilder builds SQL dynamically — adds WHERE only if filters provided
    const q = this.repo.createQueryBuilder('e').orderBy('e.createdAt', 'DESC');
    if (filters?.type) q.andWhere('e.type = :t', { t: filters.type });
    if (filters?.severity)
      q.andWhere('e.severity = :s', { s: filters.severity });
    q.take(filters?.limit || 50);
    return q.getMany();
  }

  async findOne(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  async getStats() {
    const total = await this.repo.count();
    const bySeverity = await this.repo
      .createQueryBuilder('e')
      .select('e.severity', 'severity')
      .addSelect('COUNT(*)', 'count')
      .groupBy('e.severity')
      .getRawMany();
    return { total, bySeverity };
  }
}
