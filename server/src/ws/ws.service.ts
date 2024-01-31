import { Injectable } from '@nestjs/common';
import { UpdateWDto } from './dto/update-w.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConnectToRoomDto } from './dto/connect-to-room.dto';
import { Server } from 'socket.io';

@Injectable()
export class WsService {
  constructor(private readonly prisma: PrismaService) {}

  async connectToRoom(connectToRoomDto: ConnectToRoomDto, server: Server) {
    const socketId = connectToRoomDto.socket_id;
    console.log(socketId);
    console.log(server.sockets);
    // server.sockets[socketId].emit('onError', {
    //   message: 'Room does not exist',
    // });
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
    return 'This action adds a new w';
  }

  findAll() {
    return `This action returns all ws`;
  }

  findOne(id: number) {
    return `This action returns a #${id} w`;
  }

  update(id: number, updateWDto: UpdateWDto) {
    return `This action updates a #${id} w`;
  }

  remove(id: number) {
    return `This action removes a #${id} w`;
  }
}
