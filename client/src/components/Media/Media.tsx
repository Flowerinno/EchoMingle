import { ToastifyRoot } from '@/features'
import { useEffect, useRef, useState } from 'react'

type Settings = {
  audioEnabled: boolean
  videoEnabled: boolean
  soundEnabled: boolean
}

interface MediaDeviceProps {
  isAutoStart?: boolean
  isLocal?: boolean
  stream: MediaStream | null
  toogle?: (type: 'Audio' | 'Video' | 'Sound', on: boolean) => void
  audioEnabled?: boolean
  videoEnabled?: boolean
  soundEnabled?: boolean
  cache?: Settings
  message?: string
}

export const Media = ({
  isAutoStart,
  isLocal = false,
  stream,
  toogle,
  audioEnabled = true,
  videoEnabled = true,
  soundEnabled = true,
  message = '',
}: MediaDeviceProps) => {
  const ref = useRef<HTMLVideoElement>(null)
  const [Stream, setStream] = useState<MediaStream | null>(null)
  const mutedRef = useRef(true)

  useEffect(() => {
    if (ref.current) {
      ref.current.srcObject = stream
    }

    if (!isLocal && stream) {
      setStream(stream)
    }

    return () => {
      if (stream) {
        console.log('stopping ?')
        stream.getTracks().forEach((track) => {
          track.stop()
        })
      }
    }
  }, [stream])

  let isMuted = true

  if (!isLocal && stream) {
    isMuted = false
  }

  return (
    <div className='flex flex-col gap-10 p-3'>
      <video
        id={isLocal ? 'local' : 'remote'}
        width={400}
        height={400}
        autoPlay={true}
        playsInline={true}
        muted={isMuted}
        ref={ref}
        className='rounded-md'
        style={{ transform: 'rotateY(180deg)' }}
        onPlaying={(e) => {
          if (message) {
            ToastifyRoot.success('Happy Mingle!')
          }
        }}
      />
    </div>
  )
}
