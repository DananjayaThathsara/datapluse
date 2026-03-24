import { Module } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { AlertGateway } from './alert.gateway';

@Module({
  providers: [AlertsService, AlertGateway],
  exports: [AlertsService],
})
export class AlertsModule {}
