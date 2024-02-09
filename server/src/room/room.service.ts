import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRoomDto } from 'src/ws/dto/create-w.dto';

@Injectable()
export class RoomService {
  constructor(private readonly prisma: PrismaService) {}
  async createRoom(createRoomDto: CreateRoomDto) {
    try {
      const room = await this.prisma.room.create({
        data: {
          admin_email: createRoomDto.owner_email,
        },
      });

      return { room_id: room.id };
    } catch (error) {
      return {
        room_id: null,
      };
    }
  }

  async deleteRoom(id: string, user_id: string) {
    await this.prisma.room.update({
      where: {
        id,
      },
      data: {
        is_deleted: true,
      },
    });
  }

  async getRoom(room_id: string, userEmail?: string) {
    const room = await this.prisma.room.findUnique({
      where: {
        id: room_id,
      },
      select: {
        users: true,
        is_deleted: true,
        id: true,
        admin_email: true,
      },
    });
    if (!room || room.is_deleted) return null;

    const isAdminRequest = room.admin_email === userEmail;

    if (isAdminRequest) {
      return {
        isDeleted: room?.is_deleted,
        room_id: room.id,
        isAdminConnected: true,
      };
    }

    let isAdminConnected = room.users.find(
      (user) => user?.email === room?.admin_email,
    );

    return {
      isDeleted: room?.is_deleted,
      room_id: room.id,
      isAdminConnected: isAdminRequest ? true : !!isAdminConnected,
    };
  }
}
