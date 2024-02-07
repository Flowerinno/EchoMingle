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

const clients = [];

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
    client.broadcast.emit('client_disconnect', { socket_id: client.id });
  }

  @SubscribeMessage('connect')
  async handleConnection(client: Socket) {}

  @SubscribeMessage('connect_to_room')
  findOne(client: Socket, connectToRoomDto: ConnectToRoomDto) {
    this.wsService.connectToRoom(connectToRoomDto, client, this.server);
  }

  @SubscribeMessage('send_offer')
  async handleClientStream(client: Socket, dto: SendOfferDto) {
    this.wsService.sendOffer(dto, client, this.server);
  }

  @SubscribeMessage('answer_to_offer')
  async handleAnswer(client: Socket, payload: any) {
    client.to(payload.to).emit('server_answer', {
      answer: payload.answer,
      socket_id: client.id,
    });
    // this.server.to(client.id)
  }

  @SubscribeMessage('candidate')
  async handleCandidate(client: Socket, payload: any) {
    client.broadcast.emit('server_candidate', {
      candidate: payload.candidate,
      socket_id: client.id,
    });
  }

  @SubscribeMessage('disconnect_from_room')
  async disconnectFromRoom(
    client: Socket,
    disconnectFromRoomDto: DisconnectFromRoomDto,
  ) {
    this.wsService.handleDisconnect(disconnectFromRoomDto, client, this.server);
  }
}
