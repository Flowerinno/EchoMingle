import { ClientToServerEvents, ServerToClientEvents } from '@/types/websockets.types'
import { io, Socket } from 'socket.io-client'

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  import.meta.env.VITE_WS_SERVER_URL as string,
  {
    autoConnect: false,
  },
)

socket.on('connect', () => {
  console.log('Socket connected')
})
