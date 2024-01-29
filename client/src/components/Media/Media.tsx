import { useMediaDevice } from '@/hooks/useMediaDevice'
import { useEffect, useRef } from 'react'
import { MediaController } from '../modules'

interface MediaDeviceProps {
  isAutoStart?: boolean
}

export const Media = ({ isAutoStart }: MediaDeviceProps) => {
  const { stream, start, toogle, audioEnabled, videoEnabled } = useMediaDevice({ isAutoStart })
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (ref.current) {
      ref.current.srcObject = stream
    }
  }, [stream])

  return (
    <div className='flex flex-col gap-10 p-3 min-h-screen'>
      <h1>Preview of how you'll look while mingling =\</h1>
      <video
        width={400}
        height={400}
        autoPlay
        playsInline
        muted={true}
        ref={ref}
        className='rounded-md'
        style={{ transform: 'rotateY(180deg)' }}
      />

      <MediaController toogle={toogle} audioEnabled={audioEnabled} videoEnabled={videoEnabled} />
    </div>
  )
}
