import { useEffect, useRef } from 'react'
import { MediaController } from '../modules'

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
}

export const Media = ({
  isAutoStart,
  isLocal = false,
  stream,
  toogle,
  audioEnabled = true,
  videoEnabled = true,
  soundEnabled = true,
  cache,
}: MediaDeviceProps) => {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (ref.current) {
      ref.current.srcObject = stream
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => {
          track.stop()
        })
      }
    }
  }, [stream])

  return (
    <div className='flex flex-col gap-10 p-3'>
      <video
        width={400}
        height={400}
        autoPlay
        playsInline
        muted={!soundEnabled}
        ref={ref}
        className='rounded-md'
        style={{ transform: 'rotateY(180deg)' }}
      />

      {isLocal && (
        <MediaController
          toogle={toogle}
          soundEnabled={soundEnabled}
          audioEnabled={audioEnabled}
          videoEnabled={videoEnabled}
        />
      )}
    </div>
  )
}
