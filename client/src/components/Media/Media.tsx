import { useEffect, useRef } from 'react'

interface MediaDeviceProps {
  isLocal?: boolean
  stream: MediaStream | null
  isPeersConnected?: boolean
}

export const Media = ({ isLocal = false, stream, isPeersConnected }: MediaDeviceProps) => {
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

  const styles = isPeersConnected ? 'self-end mr-16' : 'flex flex-col gap-10 p-3'

  const dimensions = isPeersConnected ? 180 : 400

  return (
    <div className={styles}>
      <video
        id={isLocal ? 'local' : 'remote'}
        width={dimensions}
        height={dimensions}
        autoPlay
        playsInline
        muted={isMuted}
        ref={ref}
        className='rounded-md max-w-400 max-h-400 z-0'
        style={{ transform: 'rotateY(180deg)' }}
      />
    </div>
  )
}
