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
    await this.prisma.room.delete({
      where: {
        id,
        users: {
          some: {
            id: user_id,
          },
        },
      },
    });
  }

  async getRoom(room_id: string) {
    const room = await this.prisma.room.findUnique({
      where: {
        id: room_id,
      },
    });

    if (!room) return null;

    return {
      isDeleted: room?.is_deleted,
      room_id: room.id,
    };
  }
}
