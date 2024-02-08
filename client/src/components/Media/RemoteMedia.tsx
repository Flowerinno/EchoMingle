import { ToastifyRoot } from '@/features'
import { usePeerConnection } from '@/hooks/usePeerConnection'
import { useEffect, useRef, useState } from 'react'

interface RemoteMediaProps {
  roomId: string
  localStream: MediaStream
  localUserId: string
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
}) => {
  const [isShown, setIsShown] = useState(false)

  const ref = useRef<HTMLVideoElement>(null)

  const { sendOffer, pc } = usePeerConnection(roomId, localStream, user, localUserId)

  const handleRemoteStream = (event: RTCTrackEvent) => {
    ref.current && (ref.current.srcObject = event.streams[0])
    setIsShown(true)
  }

  pc.ontrack = handleRemoteStream

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
