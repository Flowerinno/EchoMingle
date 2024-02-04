export interface ServerToClientEvents {
  noArg: () => void
  basicEmit: (a: number, b: string, c: Buffer) => void
  withAck: (d: string, callback: (e: number) => void) => void
  onError: (obj: { message: string }) => void
  connection: (sockets: string[]) => void
  answer_to_offer: (payload: ServerStream) => void
  server_candidate: (payload: { candidate: RTCIceCandidateInit }) => void
  server_answer: (payload: { answer: RTCSessionDescriptionInit }) => void
  new_client: (payload: { socket_id: string }) => void
}

export interface ClientToServerEvents {
  createW: (obj: { room_name: string; owner_name: string }) => void
  connectToRoom: (obj: {
    room_id: string
    user_id: string
    socket_id: string
    username: string
  }) => void
  offer: (payload: ClientStream) => void
  answer: (payload: any) => void
  candidate: (payload: any) => void
}

export interface InterServerEvents {
  ping: () => void
}

interface ClientStream {
  room_id: string
  offer: RTCSessionDescriptionInit
}

interface ServerStream {
  id: string
  room_id: string
  answer: RTCSessionDescriptionInit
  socket_id: string
  // stream: MediaStream | null
  // audioEnabled?: boolean
  // videoEnabled?: boolean
  // soundEnabled?: boolean
}
