export class ConnectToRoomDto {
  room_id: string;
  user_id: string;
  name: string;
}

export class DisconnectFromRoomDto {
  room_id: string;
  user_id: string;
  name: string;
  email: string;
}

export class SendOfferDto {
  room_id: string;
  name: string;
  remote_user_id: string;
  local_user_id: string;
  offer: RTCSessionDescriptionInit;
}
