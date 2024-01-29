export interface ServerToClientEvents {
  noArg: () => void
  basicEmit: (a: number, b: string, c: Buffer) => void
  withAck: (d: string, callback: (e: number) => void) => void
  onError: (obj: { message: string }) => void
}

export interface ClientToServerEvents {
  createW: (obj: { room_name: string; owner_name: string }) => void
  connectToRoom: (obj: {
    room_id: string
    user_id: string
    socket_id: string
    username: string
  }) => void
}

export interface InterServerEvents {
  ping: () => void
}

export interface SocketData {
  name: string
  age: number
}
