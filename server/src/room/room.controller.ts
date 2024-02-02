import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from 'src/ws/dto/create-w.dto';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post('create')
  createRoom(@Body() createRoomDto: CreateRoomDto) {
    return this.roomService.createRoom(createRoomDto);
  }

  @Post('/delete')
  deleteRoom(@Body() id: string, user_id: string) {
    return this.roomService.deleteRoom(id, user_id);
  }

  @Get('/:room_id')
  getRoom(@Param('room_id') room_id: string) {
    return this.roomService.getRoom(room_id);
  }
}
