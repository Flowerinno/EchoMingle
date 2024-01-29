import { ToastifyRoot } from '@/features'
import { useEffect, useState } from 'react'

interface MediaDeviceProps {
  STREAM?: MediaStream
  isAutoStart?: boolean
}

export const useMediaDevice = ({ STREAM, isAutoStart = false }: MediaDeviceProps) => {
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [isVideoEnabled, setIsVideoEnabled] = useState<boolean | null>(null)
  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean | null>(null)

  const constraints = {
    video: {
      facingMode: 'user',
      height: { min: 360, ideal: 720, max: 1080 },
    },
    audio: true,
  }

  const start = () => {
    console.log('here')
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        setStream(stream)
        setIsAudioEnabled(stream.getAudioTracks()[0].enabled)
        setIsVideoEnabled(stream.getVideoTracks()[0].enabled)
      })
      .catch((err) => {
        ToastifyRoot.error('Failed to get media. Please check your permissions.')
      })
  }

  const toogle = (type: 'Audio' | 'Video', on: boolean) => {
    if (stream) {
      stream[`get${type}Tracks`]().forEach((track) => {
        track.enabled = on
        type === 'Audio' ? setIsAudioEnabled(on) : setIsVideoEnabled(on)
      })
    }
  }

  // if (STREAM) {
  //   setStream(STREAM)
  //   return {
  //     stream,
  //     start,
  //     toogle,
  //   }
  // }

  useEffect(() => {
    if (isAutoStart && !stream) {
      start()
    }

    return () => {
      stream?.getTracks().forEach((track) => track.stop())
    }
  }, [])

  return {
    stream,
    start,
    toogle,
    audioEnabled: stream?.getAudioTracks()[0]?.enabled,
    videoEnabled: stream?.getVideoTracks()[0]?.enabled,
  }
}
