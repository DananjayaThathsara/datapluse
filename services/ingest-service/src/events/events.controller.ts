import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  NotFoundException,
  ValidationPipe,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './create-event.dto';

// EventsController that handles all routes related to events, including creating new events, 
// retrieving event statistics, and fetching events with optional filters. 
// It uses the EventsService to perform business logic and data access.
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  // POST /events — creates a new event
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(new ValidationPipe({ whitelist: true })) dto: CreateEventDto,
  ) {
    return { success: true, data: await this.eventsService.create(dto) };
  }

  // GET /events/stats — retrieves aggregated statistics about events
  @Get('stats')
  async getStats() {
    return { success: true, data: await this.eventsService.getStats() };
  }

  // GET /events?type=traffic_incident&severity=high&limit=20
  @Get()
  async findAll(
    @Query('type') type?: string,
    @Query('severity') severity?: string,
    @Query('limit') limit?: number,
  ) {
    const events = await this.eventsService.findAll({ type, severity, limit });
    return { success: true, count: events.length, data: events };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const event = await this.eventsService.findOne(id);
    if (!event) throw new NotFoundException(`Event ${id} not found`);
    return { success: true, data: event };
  }
}
