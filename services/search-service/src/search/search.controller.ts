import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  // GET /search?keyword=traffic&severity=high&type=incident&limit=20
  @Get()
  async search(
    @Query('keyword') keyword?: string,
    @Query('severity') severity?: string,
    @Query('type') type?: string,
    @Query('limit') limit?: number,
  ) {
    const results = await this.searchService.search({ keyword, severity, type, limit });
    return { success: true, count: results.length, data: results };
  }

  // GET /search/aggregate — used by dashboard charts
  @Get('aggregate')
  async aggregate() {
    return { success: true, data: await this.searchService.aggregate() };
  }
}