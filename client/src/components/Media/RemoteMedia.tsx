import { usePeerConnection } from '@/hooks/usePeerConnection'
import { useEffect, useRef, useState } from 'react'
import { Spinner, Video } from '../modules'
import { socket } from '@/lib/ws'

interface RemoteMediaProps {
  roomId: string
  localStream: MediaStream
  localUserId: string
  remoteUser: {
    user_id: string
    name: string
    email: string
  }
  isPreview: boolean
  iceServers: RTCIceServer[] | null
}

export const RemoteMedia: React.FC<RemoteMediaProps> = ({
  roomId,
  localStream,
  remoteUser,
  localUserId,
  isPreview,
  iceServers,
}) => {
  const { pc, remoteStream } = usePeerConnection(
    roomId,
    localStream,
    remoteUser,
    localUserId,
    iceServers,
  )
  const [reconnects, setReconnects] = useState(0)

  useEffect(() => {
    socket.on('client_reconnected', ({ user_id }) => {
      if (user_id === remoteUser.user_id) {
        console.log('Client reconnected - ' + user_id)
        setReconnects((prev) => prev + 1)
      }
    })
  }, [isPreview, remoteStream, reconnects])

  return (
    <div className='flex flex-col gap-10 p-3'>
      <Video
        id={'remote'}
        width={400}
        height={400}
        autoPlay={true}
        playsInline={true}
        muted={false}
        className='rounded-md min-w-80 min-h-80'
        style={{ transform: 'rotateY(180deg)', display: isPreview ? 'none' : 'block' }}
        srcObject={remoteStream}
      />
    </div>
  )
}
