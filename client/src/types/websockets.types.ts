export interface ServerToClientEvents {
  noArg: () => void
  basicEmit: (a: number, b: string, c: Buffer) => void
  withAck: (d: string, callback: (e: number) => void) => void
  onError: (obj: { message: string }) => void
  connection: (sockets: string[]) => void
  incoming_offer: (payload: IncomingOffer) => void
  server_candidate: (payload: { candidate: RTCIceCandidateInit; user_id: string }) => void
  server_answer: (payload: {
    answer: RTCSessionDescriptionInit
    socket_id: string
    user_id: string
  }) => void
  re_connect: (payload: {
    connected_client: string
    name: string
    user_id: string
    connected_clients: ConnectedClients[]
    adminEmail: string
  }) => void
  new_client: (payload: {
    connected_client: string
    name: string
    user_id: string
    connected_clients: ConnectedClients[]
    adminEmail: string
  }) => void
  on_remote_connected: (payload: {
    connected_client: string
    name: string
    user_id: string
    connected_clients: ConnectedClients[]
    adminEmail: string
  }) => void
  client_disconnected: (payload: {
    name: string
    user_id: string
    socket_id: string
    current_users: any[]
  }) => void
  admin_disconnected: () => void
  offer_to_empty_room: (payload: { message: string }) => void
  joined_room: (payload: {
    room_id: string
    user_id: string
    name: string
    connected_users: number
  }) => void
  connected_clients: (payload: { connected_clients: ConnectedClients[] }) => void
  client_reconnected: (payload: { user_id: string }) => void
  client_left: (payload: { user_id: string }) => void
}

export interface ClientToServerEvents {
  createW: (obj: { room_name: string; owner_name: string }) => void
  connect_to_room: (obj: { room_id: string; user_id: string; name: string }) => void
  send_offer: (payload: SendOffer) => void
  answer_to_offer: (payload: {
    room_id: string
    user_id: string
    to: string
    answer: RTCSessionDescriptionInit
  }) => void
  candidate: (payload: any) => void
  disconnect_from_room: (payload: {
    room_id: string
    user_id: string
    name: string
    email: string
  }) => void
  get_connected_clients: (payload: { room_id: string }) => void
}

export interface InterServerEvents {
  ping: () => void
}

interface ConnectedClients {
  client_id: string
  name: string
  email: string
  id: string
}

interface SendOffer {
  room_id: string
  name: string
  user_id: string
  offer: RTCSessionDescriptionInit
}

interface IncomingOffer {
  offer: RTCSessionDescriptionInit
  name: string
  user_id: string
  to: string
}
