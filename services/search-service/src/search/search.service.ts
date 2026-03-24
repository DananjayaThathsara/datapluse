import { Injectable, Logger } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);
  private readonly INDEX = 'datapulse-events'; // like a table name in ES
  constructor(private esService: ElasticsearchService) {}

  // Called by Kafka consumer — adds event to Elasticsearch index
  async indexEvent(event: any): Promise <void> {
    await this.esService.index({
      index: this.INDEX,
      id: event.id,       // same ID as PostgreSQL — keeps them in sync
      document: event,
    });
  }

  // Full-text search with optional filters
  // 'keyword' searches across message, type, location, source simultaneously
  async search(query: {
    keyword?: string; severity?: string; type?: string; limit?: number;
  }) {
    const must: any[] = [];

    if (query.keyword)
      must.push({ multi_match: {
        query: query.keyword,
        fields: ['message', 'type', 'location', 'source'],
      }});
    if (query.severity) must.push({ term: { severity: query.severity }});
    if (query.type) must.push({ term: { type: query.type }});

    const result = await this.esService.search({
      index: this.INDEX,
      size: query.limit || 50,
      query: must.length ? { bool: { must } } : { match_all: {} },
      sort: [{ createdAt: { order: 'desc' } }],
    });
    return result.hits.hits.map(h => h._source);
  }

  // Aggregations — grouped counts for dashboard charts
  // Like GROUP BY in SQL but on millions of records in milliseconds
  async aggregate() {
    const result = await this.esService.search({
      index: this.INDEX,
      size: 0, // no documents — just the counts
      aggs: {
        by_severity: { terms: { field: 'severity.keyword' }},
        by_type:     { terms: { field: 'type.keyword' }},
        per_hour:    { date_histogram: { field: 'createdAt', calendar_interval: 'hour' }},
      },
    });
    return result.aggregations;
  }
}