import { PartialType } from '@nestjs/mapped-types';
import { CreateRoomDto } from './create-w.dto';

export class UpdateWDto extends PartialType(CreateRoomDto) {
  id: number;
}
