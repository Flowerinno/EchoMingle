export class ClientStreamDto {
  room_id: string;
  stream: MediaStream | null;
  audioEnabled?: boolean;
  videoEnabled?: boolean;
  soundEnabled?: boolean;
}
