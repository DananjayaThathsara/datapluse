import { Controller, Post, Param, Body } from '@nestjs/common';
import { WebhookService } from './webhook.service';

@Controller('webhook')
export class WebhookController {
  constructor(private webhookService: WebhookService) {}

  // This endpoint receives incoming webhooks from various sources.
  // The 'source' parameter identifies which transformer to use for processing the raw data.
  // The controller then transforms the raw format into a standard format and forwards it to the ingest-service for further processing.
  @Post(':source')
  async receive(@Param('source') source: string, @Body() rawData: any) {
    return this.webhookService.process(source, rawData);
  }
}
