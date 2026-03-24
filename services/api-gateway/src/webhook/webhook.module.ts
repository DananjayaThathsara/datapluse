import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';

@Module({
  imports: [HttpModule], // ← this line is the fix
  controllers: [WebhookController],
  providers: [WebhookService],
})
export class WebhookModule {}
