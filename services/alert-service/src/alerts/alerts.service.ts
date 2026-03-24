import { Injectable, Logger } from '@nestjs/common';
import { AlertGateway } from './alert.gateway';

@Injectable()
export class AlertsService {
  private logger = new Logger(AlertsService.name);
  constructor(private gateway: AlertGateway) {}

  // Called by Kafka consumer every time a new event arrives
  async processEvent(event: any): Promise<void> {
    this.logger.log(`Processing: ${event.type} [${event.severity}]`);
    this.gateway.pushAlert({
      id: event.id,
      type: event.type,
      severity: event.severity,
      location: event.location,
      message: event.message,
      source: event.source,
      timestamp: event.createdAt,
    });
  }
}
