import { Media } from '@/components'
import { RemoteMedia } from '@/components/Media'
import { MediaController } from '@/components/modules'
import { useMediaDevice } from '@/hooks/useMediaDevice'
import { socket } from '@/lib/ws'
import { ERoutes } from '@/routes'
import { VerifyResponse } from '@/types/auth.types'
import { getItem } from '@/utils/index'
import { removeRoomLink } from '@/utils/room'
import { useEffect, useState } from 'react'
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
  const roomId = window.location.pathname.split('rooms/')[1]

  const [peerConnections, setPeerConnections] = useState<Client[] | []>([])
  const [adminEmail, setAdminEmail] = useState('')
  const cache = getItem<Settings>('echomingle_media_settings')

  const { stream, toogle, audioEnabled, videoEnabled, soundEnabled } = useMediaDevice({
    isAutoStart: true,
    cache,
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
    setAdminEmail(data.adminEmail)
  })

  socket.on('client_disconnected', ({ name, user_id, current_users }) => {
    setPeerConnections((prev) => prev.filter((user) => user.user_id !== user_id))
  })

  socket.on('admin_disconnected', () => {
    socket.close()
    removeRoomLink()
    navigate(ERoutes.rooms, {
      replace: true,
      state: { isAdminDisconnected: true },
    })
  })

  useEffect(() => {
    if (!roomId) {
      navigate(ERoutes.home)
    }
    socket.connect()

    socket.emit('connect_to_room', {
      room_id: roomId,
      user_id: localUser.id,
      name: localUser.name,
    })
  }, [roomId])

  const disconnect = () => {
    socket.emit('disconnect_from_room', {
      room_id: roomId,
      user_id: localUser.id,
      name: localUser.name,
    })
    navigate(ERoutes.home)
  }

  return (
    <div className='flex flex-col gap-10 items-center justify-start w-full'>
      <div className='flex flex-row flex-wrap gap-5 items-start justify-center p-4'>
        <Media isLocal stream={stream} />
        {peerConnections?.length > 0 &&
          stream &&
          peerConnections.map((user) => (
            <RemoteMedia
              key={user.user_id}
              adminEmail={adminEmail}
              localUserId={localUser?.id}
              localStream={stream}
              localEmail={localUser?.email}
              roomId={roomId}
              user={user}
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
