import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

// WebSocket gateway that allows pushing alerts to connected clients in real-time
@WebSocketGateway({ cors: { origin: '*' } })
export class AlertGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger = new Logger(AlertGateway.name);

  // Runs automatically when a browser connects
  handleConnection(client: Socket) {
    this.logger.log(`Browser connected: ${client.id}`);
  }

  // Runs automatically when a browser disconnects (tab closed)
  handleDisconnect(client: Socket) {
    this.logger.log(`Browser disconnected: ${client.id}`);
  }

  // Method to push a new alert to all connected browsers
  pushAlert(alert: any): void {
    this.server.emit('new-alert', alert);
    this.logger.log(`Pushed to ${this.server.sockets.sockets.size} browsers`);
  }
}
