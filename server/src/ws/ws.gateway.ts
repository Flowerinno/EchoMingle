import { Logger } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import {
  ConnectToRoomDto,
  DisconnectFromRoomDto,
  SendOfferDto,
} from './dto/connect-to-room.dto';
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
    client.broadcast
      .to(room_id)
      .emit('client_disconnect', { socket_id: client.id });
  }

  @SubscribeMessage('connect_to_room')
  findOne(client: Socket, connectToRoomDto: ConnectToRoomDto) {
    this.wsService.connectToRoom(connectToRoomDto, client, this.server);
  }

  @SubscribeMessage('send_offer')
  async handleClientStream(client: Socket, dto: SendOfferDto) {
    this.logger.log('SENDING OFFER');
    this.wsService.sendOffer(dto, client, this.server);
  }

  @SubscribeMessage('answer_to_offer')
  async handleAnswer(client: Socket, payload: any) {
    this.logger.log('Answer to offer ' + payload.to + ' ' + payload.remote_user_id);
    client.to(payload.to).emit('server_answer', {
      answer: payload.answer,
      socket_id: client.id,
      remote_user_id: payload.remote_user_id,
      local_user_id: payload.local_user_id
    });
  }

  @SubscribeMessage('candidate')
  async handleCandidate(client: Socket, payload: any) {
    client.broadcast.to(payload.room_id).emit('server_candidate', {
      candidate: payload.candidate,
      socket_id: client.id,
      remote_user_id: payload.remote_user_id,
      local_user_id: payload.local_user_id,
    });
  }

  @SubscribeMessage('disconnect_from_room')
  async disconnectFromRoom(
    client: Socket,
    disconnectFromRoomDto: DisconnectFromRoomDto,
  ) {
    this.wsService.handleDisconnect(disconnectFromRoomDto, client, this.server);
  }

  @SubscribeMessage('get_connected_clients')
  async getConnectedClients(client: Socket, dto: { room_id: string }) {
    this.logger.log('Getting connected clients for ' + dto.room_id)
    this.wsService.getConnectedClients(client, dto.room_id);
  }
}
