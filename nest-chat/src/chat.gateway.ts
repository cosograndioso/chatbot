import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*', // Sostituisci con 'http://localhost:3000' in produzione
  },
})
export class ChatGateway {
  @WebSocketServer()
  server!: Server;

  @SubscribeMessage('message')
  handleMessage(
    @MessageBody() message: { sender: string; text: string },
  ): void {
    console.log('📨 Messaggio ricevuto:', message);
    this.server.emit('message', { ...message });
  }
}
