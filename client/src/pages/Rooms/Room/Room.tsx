import { Media } from '@/components'
import { RemoteMedia } from '@/components/Media'
import { Button, MediaController } from '@/components/modules'
import { useMediaDevice } from '@/hooks/useMediaDevice'
import { socket } from '@/lib/ws'
import { ERoutes } from '@/routes'
import { VerifyResponse } from '@/types/auth.types'
import { getItem } from '@/utils/index'
import { removeRoomLink } from '@/utils/room'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router'

type Settings = {
  audioEnabled: boolean
  videoEnabled: boolean
  soundEnabled: boolean
}

type Client = {
  user_id: string
  name: string
  email: string
}

export const Room = () => {
  const navigate = useNavigate()
  const localUser = useOutletContext<VerifyResponse>()
  const roomId = useMemo(() => window.location.pathname.split('rooms/')[1], [])
  const [peerConnections, setPeerConnections] = useState<Client[] | []>([])
  const [isPreview, setIsPreview] = useState(true)
  const [isConnected, setIsConnected] = useState(false)
  const cache = getItem<Settings>('echomingle_media_settings')

  const { stream, toogle, audioEnabled, videoEnabled, soundEnabled } = useMediaDevice({
    isAutoStart: true,
    cache,
  })

  const disconnect = () => {
    socket.emit('disconnect_from_room', {
      room_id: roomId,
      user_id: localUser.id,
      name: localUser.name,
      email: localUser.email,
    })
    removeRoomLink()
    navigate(ERoutes.rooms)
    window.location.reload()
  }

  const joinRoom = () => {
    if (!roomId || !localUser?.email) return
    setIsPreview(false)
  }

  useEffect(() => {
    socket.connect()

    return () => {
      socket.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!roomId) {
      navigate(ERoutes.home)
    }

    if (!isConnected) {
      socket.emit('get_connected_clients', { room_id: roomId })
      socket.emit('connect_to_room', {
        room_id: roomId,
        user_id: localUser.id,
        name: localUser.name,
      })
      setIsConnected(true)
    }

    socket.on('client_left', (data) => {
      setPeerConnections((prev) => prev.filter((client) => client.user_id !== data.user_id))
    })

    socket.on('connected_clients', (data) => {
      const filtered = data.connected_clients.filter((client) => client.id !== localUser.id)
      setPeerConnections(
        filtered.map((client) => ({
          user_id: client.id,
          name: client.name,
          email: client.email,
        })) as Client[],
      )
    })

    socket.on('new_client', (data) => {
      const filtered = data.connected_clients.filter((client) => client.id !== localUser.id)
      setPeerConnections(
        filtered.map((client) => ({
          user_id: client.id,
          name: client.name,
          email: client.email,
        })) as Client[],
      )
    })

    socket.on('admin_disconnected', () => {
      socket.close()
      removeRoomLink()
      navigate(ERoutes.rooms, {
        state: { isAdminDisconnected: true },
      })
      window.location.reload()
    })
  }, [isPreview, isConnected, stream, joinRoom])

  return (
    <div className='flex flex-col gap-10 items-center justify-start w-full'>
      <div className='flex flex-row flex-wrap gap-5 items-start justify-center p-4'>
        <Media isLocal stream={stream} />
        {isPreview && <Button label={'Join'} className='w-8/12' onClick={joinRoom} />}
        {stream &&
          isConnected &&
          peerConnections.map((user) => (
            <RemoteMedia
              isPreview={isPreview}
              key={user.user_id}
              localUserId={localUser?.id}
              localStream={stream}
              roomId={roomId}
              remoteUser={user}
            />
          ))}
      </div>
      <div>
        <MediaController
          disconnect={disconnect}
          toogle={toogle}
          soundEnabled={soundEnabled}
          audioEnabled={audioEnabled}
          videoEnabled={videoEnabled}
        />
      </div>
    </div>
  )
}
