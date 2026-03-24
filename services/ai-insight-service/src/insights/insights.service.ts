import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import Anthropic from '@anthropic-ai/sdk';
import { InsightGateway } from './insight.gateway';

// Service that generates AI insights based on recent events in Elasticsearch and pushes them to clients via WebSocket
@Injectable()
export class InsightsService {
  private logger = new Logger(InsightsService.name);
  private anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  // Inject ElasticsearchService to query events and InsightGateway to push insights to clients 
  constructor(
    private esService: ElasticsearchService,
    private gateway: InsightGateway,
  ) {}

  // Cron job that runs every minute to generate a new AI insight based on events from the last 10 minutes
  @Cron(CronExpression.EVERY_MINUTE)
  async generateInsight(): Promise<void> {
    this.logger.log('Generating AI insight...');

    try {
      const result = await this.esService.search({
        index: 'datapulse-events',
        size: 30,
        query: { range: { createdAt: { gte: 'now-10m' } } },
        sort: [{ createdAt: { order: 'desc' } }],
      });

      const events = result.hits.hits.map((h: any) => h._source);
      if (!events.length) {
        this.logger.log('No recent events — skipping');
        return;
      }

      const message = await this.anthropic.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 200,
        messages: [
          {
            role: 'user',
            content: `You are an operations analyst. Write a 2-3 sentence plain English
            summary of what is happening, what is unusual, and what needs attention.
            Be specific with locations and numbers.
            Events: ${JSON.stringify(events.slice(0, 20))}`,
          },
        ],
      });

      const insight =
        message.content[0].type === 'text' ? message.content[0].text : '';

      this.gateway.pushInsight(insight);
      this.logger.log('AI insight generated and pushed');
    } catch (err: any) {
      if (err?.meta?.body?.error?.type === 'index_not_found_exception') {
        this.logger.log('ES index not ready yet — will retry next minute');
        return;
      }
      this.logger.error('Failed to generate insight', err?.message);
    }
  }
}
