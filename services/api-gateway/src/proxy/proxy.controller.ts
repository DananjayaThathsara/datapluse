import {
  Controller,
  All,
  Req,
  Res,
  UseGuards,
  HttpException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { firstValueFrom } from 'rxjs';

// ProxyController that handles all incoming requests and forwards them to the appropriate microservice based on the URL path. It uses JwtAuthGuard to protect routes and validates JWT tokens before proxying requests.
const SERVICES: Record<string, string> = {
  events: process.env.INGEST_SERVICE_URL || 'http://localhost:3001',
  search: process.env.SEARCH_SERVICE_URL || 'http://localhost:3002',
};

// The ProxyController uses the HttpService to make HTTP requests to the target microservices. It extracts the first segment of the URL path to determine which service to forward the request to. If the service is not found, it returns a 404 error. If the target service is unavailable, it returns a 503 error.
@Controller()
export class ProxyController {
  constructor(private http: HttpService) {}

  @UseGuards(JwtAuthGuard)
  @All('*path')
  async proxy(@Req() req: any, @Res() res: any) {
    // Extract first URL segment — e.g. /events/stats → 'events'
    const segments = req.path.split('/').filter(Boolean);
    const service = segments[0];

    const target = SERVICES[service];
    if (!target) {
      return res
        .status(404)
        .json({ message: `Service '${service}' not found` });
    }

    try {
      const response = await firstValueFrom(
        this.http.request({
          method: req.method,
          url: `${target}${req.url}`,
          data: req.body,
          params: req.query,
          headers: { 'Content-Type': 'application/json' },
          validateStatus: () => true,
        }),
      );
      return res.status(response.status).json(response.data);
    } catch {
      throw new HttpException('Service unavailable', 503);
    }
  }
}
