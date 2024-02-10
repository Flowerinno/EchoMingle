import { usePeerConnection } from '@/hooks/usePeerConnection'
import { useEffect, useRef, useState } from 'react'
import { Video } from '../modules'

interface RemoteMediaProps {
  roomId: string
  localStream: MediaStream
  localUserId: string
  remoteUser: {
    user_id: string
    name: string
    email: string
  }
}

export const RemoteMedia: React.FC<RemoteMediaProps> = ({
  roomId,
  localStream,
  remoteUser,
  localUserId,
}) => {
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null)
  const [isShown, setIsShown] = useState(false)
  const { pc } = usePeerConnection(roomId, localStream, remoteUser, localUserId)

  useEffect(() => {
    if (!pc) return

    const handleRemoteStream = (event: RTCTrackEvent) => {
      const stream = event.streams[0]
      if (!remoteStream) {
        setRemoteStream(stream)
        setIsShown(true)
      }
    }

    pc.ontrack = handleRemoteStream
  }, [isShown, remoteStream, remoteStream?.active, pc])
  console.log(remoteStream)
  return (
    <div className='flex flex-col gap-10 p-3'>
      <Video
        id={'remote'}
        width={400}
        height={400}
        autoPlay={true}
        playsInline={true}
        muted={false}
        className='rounded-md max-w-400 max-h-400'
        style={{ transform: 'rotateY(180deg)', display: isShown ? 'block' : 'none' }}
        srcObject={remoteStream}
      />
    </div>
  )
}
