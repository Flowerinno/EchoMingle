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

const connections = [];

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
  async handleDisconnect(client: Socket) {
    connections.splice(connections.indexOf(client.id), 1);
    this.server.emit('connection', connections);
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('connect')
  async handleConnection(client: Socket) {
    connections.push(client.id);
    this.server.emit('connection', connections);
    this.logger.log(`Client connected: ${client.id}`);
  }

  @SubscribeMessage('stream')
  async handleClientStream(client: Socket, payload: ClientStreamDto) {
    if (!payload.stream) return;

    this.server.emit('server_stream', {
      stream: payload.stream,
      socket_id: client.id,
      audioEnabled: payload.audioEnabled,
      videoEnabled: payload.videoEnabled,
      soundEnabled: payload.soundEnabled,
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
    console.log(user.socket_id);
    return this.wsService.connectToRoom(user, this.server);
  }
}
