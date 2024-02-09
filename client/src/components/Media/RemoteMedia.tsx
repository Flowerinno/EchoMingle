import { usePeerConnection } from '@/hooks/usePeerConnection'
import { useRef, useState } from 'react'

interface RemoteMediaProps {
  roomId: string
  localStream: MediaStream
  localUserId: string
  localEmail: string
  user: {
    user_id: string
    name: string
    email: string
  }
  adminEmail: string
}

export const RemoteMedia: React.FC<RemoteMediaProps> = ({
  roomId,
  localStream,
  user,
  localUserId,
  adminEmail,
  localEmail,
}) => {
  const [isShown, setIsShown] = useState(false)

  const ref = useRef<HTMLVideoElement>(null)

  const { pc } = usePeerConnection(roomId, localStream, user, localUserId, adminEmail, localEmail)

  const handleRemoteStream = (event: RTCTrackEvent) => {
    ref.current && (ref.current.srcObject = event.streams[0])
    setIsShown(true)
  }

  if (!pc) return

  pc.ontrack = handleRemoteStream

  pc.onconnectionstatechange = () => {
    if (pc.connectionState === 'failed') {
      pc.restartIce()
    }
  }

  return (
    <div className='flex flex-col gap-10 p-3'>
      <video
        id={'remote'}
        width={400}
        height={400}
        autoPlay={true}
        playsInline={true}
        muted={false}
        ref={ref}
        className='rounded-md max-w-400 max-h-400'
        style={{ transform: 'rotateY(180deg)', display: isShown ? 'block' : 'none' }}
      />
    </div>
  )
}
