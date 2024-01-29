import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateRoomDto {
  @IsEmail()
  @IsNotEmpty()
  owner_email: string;
}
