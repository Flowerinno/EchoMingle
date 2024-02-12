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
        client.emit('on_error', {
          message: 'Room does not exist',
        });
        return;
      }

      if (room.is_deleted) {
        client.emit('admin_disconnected', {
          message: 'Room has been deleted',
        });
        return;
      }
      client.join(connectToRoomDto.room_id);

      const existingUser = room.users.find(
        (user) => user.id === connectToRoomDto.user_id,
      );

      if (existingUser) {
        this.logger.log('User already exists in the room');
        client.broadcast.to(connectToRoomDto.room_id).emit('new_client', {
          connected_client: client.id,
          name: connectToRoomDto.name,
          user_id: connectToRoomDto.user_id,
          connected_clients: room.users,
          adminEmail: room.admin_email,
        });
        this.logger.log('EMITTING ON_REMOTE_CONNECTED');

        client.broadcast
          .to(connectToRoomDto.room_id)
          .emit('client_reconnected', {
            user_id: connectToRoomDto.user_id,
          });

        client.emit('on_remote_connected', {
          connected_client: client.id,
          name: connectToRoomDto.name,
          user_id: connectToRoomDto.user_id,
          connected_clients: room.users,
          adminEmail: room.admin_email,
        });

        return;
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

      client.broadcast.to(connectToRoomDto.room_id).emit('new_client', {
        connected_client: client.id,
        name: connectToRoomDto.name,
        user_id: connectToRoomDto.user_id,
        connected_clients: updatedRoom.users,
        adminEmail: room.admin_email,
      });
      this.logger.log('EMITTING ON_REMOTE_CONNECTED');
      client.emit('on_remote_connected', {
        connected_client: client.id,
        name: connectToRoomDto.name,
        user_id: connectToRoomDto.user_id,
        connected_clients: room.users,
        adminEmail: room.admin_email,
      });

      client.broadcast.to(connectToRoomDto.room_id).emit('client_reconnected', {
        user_id: connectToRoomDto.user_id,
      });
    } catch (error) {
      client.emit('on_error', {
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
      const room = await this.prisma.room.findUnique({
        where: { id: dto.room_id },
        select: { users: { where: { id: dto.user_id } }, admin_email: true },
      });

      const isAdminLeft = dto.email === room.admin_email;

      await this.prisma.room.update({
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

      if (isAdminLeft) {
        server.to(dto.room_id).emit('admin_disconnected');
        this.prisma.room.update({
          where: { id: dto.room_id },
          data: {
            is_deleted: true,
          },
        });
        client.leave(dto.room_id);
        client.disconnect();

        this.logger.log('Admin disconnected');
        return;
      }

      server.to(dto.room_id).emit('client_disconnected', {
        name: dto.name,
        user_id: dto.user_id,
        socket_id: client.id,
        current_users: room.users,
      });

      server.to(dto.room_id).emit('client_left', {
        user_id: dto.user_id,
      });

      client.leave(dto.room_id);
      client.disconnect();

      this.logger.log(`Client disconnected: ${client.id}`);
    } catch (error) {
      console.log('DISCONNECT ERROR', error);
      server.to(client.id).emit('on_error', {
        message: 'An error occurred while disconnecting from the room',
      });
    }
  }

  async sendOffer(payload: SendOfferDto, client: Socket, server: Server) {
    this.logger.log('Sending offer to ' + payload.user_id);
    try {
      const room = await this.prisma.room.findUnique({
        where: { id: payload.room_id },
        select: { users: true },
      });

      if (!room) {
        client.emit('on_error', {
          message: 'Room does not exist',
        });
        return;
      }

      const connected_users = room.users.some(
        (user) => user.id !== payload.user_id,
      );

      if (!connected_users) {
        client.emit('offer_to_empty_room', {
          message: 'The room is empty',
        });
        return;
      }

      client.broadcast.to(payload.room_id).emit('incoming_offer', {
        to: client.id,
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

  async getConnectedClients(client: Socket, room_id: string) {
    const room = await this.prisma.room.findUnique({
      where: { id: room_id },
      select: { users: true },
    });

    client.emit('connected_clients', {
      connected_clients: room.users,
    });
  }
}
