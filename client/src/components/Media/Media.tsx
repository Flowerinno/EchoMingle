import { useEffect, useRef } from 'react'

interface MediaDeviceProps {
  isLocal?: boolean
  stream: MediaStream | null
}

export const Media = ({ isLocal = false, stream }: MediaDeviceProps) => {
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
        autoPlay
        playsInline
        muted={isMuted}
        ref={ref}
        className='rounded-md max-w-400 max-h-400'
        style={{ transform: 'rotateY(180deg)' }}
      />
    </div>
  )
}
