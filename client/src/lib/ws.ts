import { ClientToServerEvents, ServerToClientEvents } from '@/types/websockets.types'
import { io, Socket } from 'socket.io-client'
import { config } from '@/config/env.config'

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(config.ws_url, {
  autoConnect: false,
  forceNew: false,
})
