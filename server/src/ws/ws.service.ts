import { Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-w.dto';
import { UpdateWDto } from './dto/update-w.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class WsService {
  constructor(private readonly prisma: PrismaService) {}
  createRoom(createRoomDto: CreateRoomDto) {
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
