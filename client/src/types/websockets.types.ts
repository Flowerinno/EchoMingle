export interface ServerToClientEvents {
  noArg: () => void
  basicEmit: (a: number, b: string, c: Buffer) => void
  withAck: (d: string, callback: (e: number) => void) => void
  onError: (obj: { message: string }) => void
  connection: (sockets: string[]) => void
  server_stream: (payload: ServerStream) => void
}

export interface ClientToServerEvents {
  createW: (obj: { room_name: string; owner_name: string }) => void
  connectToRoom: (obj: {
    room_id: string
    user_id: string
    socket_id: string
    username: string
  }) => void
  stream: (payload: ClientStream) => void
}

export interface InterServerEvents {
  ping: () => void
}

interface ClientStream {
  room_id: string
  stream: MediaStream | null
  audioEnabled?: boolean
  videoEnabled?: boolean
  soundEnabled?: boolean
}

interface ServerStream {
  room_id: string
  stream: MediaStream | null
  socket_id: string
  audioEnabled?: boolean
  videoEnabled?: boolean
  soundEnabled?: boolean
}
