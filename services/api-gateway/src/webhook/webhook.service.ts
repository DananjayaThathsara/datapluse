import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);

  constructor(private readonly httpService: HttpService) {}

  async process(source: string, data: any): Promise<any> {
    this.logger.log(`Webhook received from source: ${source}`);

    // Forward to ingest-service
    const ingestUrl = process.env.INGEST_SERVICE_URL || 'http://localhost:3001';

    try {
      const response = await firstValueFrom(
        this.httpService.post<any>(`${ingestUrl}/events`, {
          type: data.type || 'webhook',
          source: source,
          severity: data.severity || 'low',
          message: data.message || JSON.stringify(data),
          metadata: data,
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error(
        `Failed to forward webhook to ingest-service`,
        error.message,
      );
      throw error;
    }
  }
}
