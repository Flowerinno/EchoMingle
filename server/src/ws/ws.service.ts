import { Injectable, Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConnectToRoomDto } from './dto/connect-to-room.dto';

@Injectable()
export class WsService {
  constructor(private readonly prisma: PrismaService) {}

  logger = new Logger(WsService.name);

  async connectToRoom(connectToRoomDto: ConnectToRoomDto, server: Server) {
    const socketId = connectToRoomDto.socket_id;

    try {
      await this.prisma.room.findUniqueOrThrow({
        where: {
          id: connectToRoomDto.room_id,
        },
      });
    } catch (error) {
      server.sockets[socketId].emit('onError', {
        message: 'Room does not exist',
      });
    }
  }

  async handleDisconnect(room_id: string, client: Socket, server: Server) {
    const socketId = client.id;
    this.prisma.room.update({
      where: { id: room_id },
      data: {
        sockets: {
          delete: {
            id: socketId,
          },
        },
      },
    });

    this.logger.log(`Client disconnected: ${client.id}`);
  }
}
