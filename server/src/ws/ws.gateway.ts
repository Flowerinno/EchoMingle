import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { WsService } from './ws.service';
import { CreateRoomDto } from './dto/create-w.dto';
import { UpdateWDto } from './dto/update-w.dto';
import { Server } from 'socket.io';
import { ConnectToRoomDto } from './dto/connect-to-room.dto';

@WebSocketGateway(8090, {
  cors: { origin: '*' },
  namespace: 'ws',
})
export class WsGateway {
  constructor(private readonly wsService: WsService) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('createRoom')
  create(@MessageBody() createRoomDto: CreateRoomDto) {
    return this.wsService.createRoom(createRoomDto);
  }

  @SubscribeMessage('findAllWs')
  findAll() {
    return this.wsService.findAll();
  }

  @SubscribeMessage('connectToRoom')
  findOne(@MessageBody() connectToRoomDto: ConnectToRoomDto) {
    console.log('connectToRoomDto', connectToRoomDto);
    const roomId = connectToRoomDto.room_id;

    const user = {
      id: connectToRoomDto.user_id,
      socket_id: connectToRoomDto.socket_id,
      username: connectToRoomDto.username,
    };

    // return this.wsService.findOne(id);
  }

  @SubscribeMessage('updateW')
  update(@MessageBody() updateWDto: UpdateWDto) {
    return this.wsService.update(updateWDto.id, updateWDto);
  }

  @SubscribeMessage('removeW')
  remove(@MessageBody() id: number) {
    return this.wsService.remove(id);
  }
}
