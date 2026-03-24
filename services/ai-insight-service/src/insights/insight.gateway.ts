import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

// WebSocket gateway that allows pushing AI-generated insights to connected clients in real-time  
@WebSocketGateway({ cors: { origin: '*' } })
export class InsightGateway {
  @WebSocketServer() server: Server;

  pushInsight(insight: string): void {
    this.server.emit('ai-insight', {
      text: insight,
      generatedAt: new Date().toISOString(),
    });
  }
}