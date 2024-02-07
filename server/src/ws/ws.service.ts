import { Injectable, Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  ConnectToRoomDto,
  DisconnectFromRoomDto,
  SendOfferDto,
} from './dto/connect-to-room.dto';

@Injectable()
export class WsService {
  constructor(private readonly prisma: PrismaService) {}

  logger = new Logger(WsService.name);

  async connectToRoom(
    connectToRoomDto: ConnectToRoomDto,
    client: Socket,
    server: Server,
  ) {
    try {
      const room = await this.prisma.room.findUnique({
        where: {
          id: connectToRoomDto.room_id,
        },
        include: {
          users: true,
        },
      });

      if (!room) {
        server.to(client.id).emit('on_error', {
          message: 'Room does not exist',
        });
        return;
      }

      const existingUser = room.users.find(
        (user) => user.id === connectToRoomDto.user_id,
      );

      if (existingUser) {
        server.emit('new_client', {
          connected_client: client.id,
          name: connectToRoomDto.name,
          user_id: connectToRoomDto.user_id,
          connected_clients: room.users,
        });
      }

      const updatedRoom = await this.prisma.room.update({
        where: {
          id: connectToRoomDto.room_id,
        },
        data: {
          users: {
            connect: {
              id: connectToRoomDto.user_id,
              name: connectToRoomDto.name,
            },
          },
        },
        select: {
          users: true,
        },
      });

      server.emit('new_client', {
        connected_client: client.id,
        name: connectToRoomDto.name,
        user_id: connectToRoomDto.user_id,
        connected_clients: updatedRoom.users,
      });
    } catch (error) {
      server.to(client.id).emit('on_error', {
        message: 'An error occurred while connecting to the room',
      });
    }
  }

  async handleDisconnect(
    dto: DisconnectFromRoomDto,
    client: Socket,
    server: Server,
  ) {
    try {
      const isConnectedToRoom = await this.prisma.room.findUnique({
        where: { id: dto.room_id },
        select: { users: { where: { id: dto.user_id } } },
      });

      if (!isConnectedToRoom) {
        return;
      }

      const room = await this.prisma.room.update({
        where: { id: dto.room_id },
        data: {
          users: {
            disconnect: {
              id: dto.user_id,
            },
          },
        },
        select: {
          users: true,
        },
      });

      server.emit('client_disconnected', {
        name: dto.name,
        user_id: dto.user_id,
        socket_id: client.id,
        current_users: room.users,
      });

      this.logger.log(`Client disconnected: ${client.id}`);
    } catch (error) {
      server.to(client.id).emit('on_error', {
        message: 'An error occurred while disconnecting from the room',
      });
    }
  }

  async sendOffer(payload: SendOfferDto, client: Socket, server: Server) {
    try {
      const room = await this.prisma.room.findUnique({
        where: { id: payload.room_id },
        select: { users: true },
      });

      if (!room) {
        server.to(client.id).emit('on_error', {
          message: 'Room does not exist',
        });
        return;
      }

      const connected_users = room.users.some(
        (user) => user.id !== payload.user_id,
      );

      if (!connected_users) {
        server.to(client.id).emit('offer_to_empty_room', {
          message: 'The room is empty',
        });
        return;
      }

      client.broadcast.emit('incoming_offer', {
        socket_id: client.id,
        offer: payload.offer,
        user_id: payload.user_id,
        name: payload.name,
      });
    } catch (error) {
      server.to(client.id).emit('on_error', {
        message: 'An error occurred while sending the offer',
      });
    }
  }
}
