import { config } from '@/config/env.config'
import { ClientToServerEvents, ServerToClientEvents } from '@/types/websockets.types'
import { Socket, io } from 'socket.io-client'

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(config.ws_url, {
  autoConnect: false,
  forceNew: false,
})
