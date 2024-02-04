import { Logger } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ClientStreamDto } from './dto/client-stream.dto';
import { ConnectToRoomDto } from './dto/connect-to-room.dto';
import { WsService } from './ws.service';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: 'ws',
})
export class WsGateway {
  constructor(private readonly wsService: WsService) {}

  @WebSocketServer()
  server: Server;
  logger = new Logger(WsGateway.name);

  @SubscribeMessage('disconnect')
  async handleDisconnect(client: Socket, room_id: string) {
    // return await this.wsService.handleDisconnect(room_id, client, this.server);
    client.broadcast.emit('client_disconnect', { socket_id: client.id });
  }

  @SubscribeMessage('connect')
  async handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    client.broadcast.emit('new_client', { socket_id: client.id });
  }

  @SubscribeMessage('offer')
  async handleClientStream(client: Socket, payload: ClientStreamDto) {
    if (!payload.offer) return;

    this.logger.log(`Emitting client ${client.id} stream`);

    client.broadcast.emit('answer_to_offer', {
      answer: payload.offer,
      socket_id: client.id,
      room_id: payload.room_id,
    });
  }

  @SubscribeMessage('answer')
  async handleAnswer(client: Socket, payload: any) {
    this.logger.log(`Emitting client ${client.id} answer`);

    client.broadcast.emit('server_answer', {
      answer: payload.answer,
      socket_id: client.id,
    });
  }

  @SubscribeMessage('candidate')
  async handleCandidate(client: Socket, payload: any) {
    this.logger.log(`Emitting client ${client.id} candidate`);

    client.broadcast.emit('server_candidate', {
      candidate: payload.candidate,
      socket_id: client.id,
    });
  }

  @SubscribeMessage('connectToRoom')
  findOne(@MessageBody() connectToRoomDto: ConnectToRoomDto) {
    const user = {
      room_id: connectToRoomDto.room_id,
      user_id: connectToRoomDto.user_id,
      socket_id: connectToRoomDto.socket_id,
      username: connectToRoomDto.username,
    };

    return this.wsService.connectToRoom(user, this.server);
  }
}
