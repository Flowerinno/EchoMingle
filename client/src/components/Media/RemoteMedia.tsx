import { usePeerConnection } from '@/hooks/usePeerConnection'
import { useRef, useState } from 'react'
import { Button } from '../modules'

interface RemoteMediaProps {
  roomId: string
  localStream: MediaStream
  user: {
    user_id: string
    name: string
  }
}

export const RemoteMedia: React.FC<RemoteMediaProps> = ({ roomId, localStream, user }) => {
  const [isShown, setIsShown] = useState(false)

  const ref = useRef<HTMLVideoElement>(null)

  const { acceptUserToCall, pc } = usePeerConnection(roomId, localStream, user)

  const handleRemoteStream = (event: RTCTrackEvent) => {
    ref.current && (ref.current.srcObject = event.streams[0])
    setIsShown(true)
  }

  pc.ontrack = handleRemoteStream

  const handleAcceptUserToCall = () => {
    acceptUserToCall()
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

      {!isShown && (
        <Button
          label='New user joined. Would you like to see him?'
          className='border-2 p-2'
          onClick={handleAcceptUserToCall}
        />
      )}
    </div>
  )
}
