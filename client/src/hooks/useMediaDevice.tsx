import { ToastifyRoot } from '@/features'
import { useEffect, useState } from 'react'

type Settings = {
  audioEnabled: boolean
  videoEnabled: boolean
  soundEnabled: boolean
}

interface MediaDeviceProps {
  isAutoStart?: boolean
  cache?: Settings
}

export const useMediaDevice = ({ isAutoStart = true, cache }: MediaDeviceProps) => {
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [isVideoEnabled, setIsVideoEnabled] = useState<boolean | null>(null)
  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean | null>(null)
  const [soundEnabled, setSoundEnabled] = useState(false)

  const constraints = {
    video: {
      facingMode: 'user',
      height: { min: 360, ideal: 720, max: 1080 },
    },
    audio: true,
  }

  const start = () => {
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        setStream(stream)

        if (cache) {
          setIsAudioEnabled(cache.audioEnabled)
          setIsVideoEnabled(cache.videoEnabled)
          stream.getAudioTracks()[0].enabled = cache.audioEnabled
          stream.getVideoTracks()[0].enabled = cache.videoEnabled
          return
        }
        setIsAudioEnabled(stream.getAudioTracks()[0].enabled)
        setIsVideoEnabled(stream.getVideoTracks()[0].enabled)
      })
      .catch((err) => {
        ToastifyRoot.error('Failed to get media. Please check your permissions.')
      })
  }

  const toogle = (type: 'Audio' | 'Video' | 'Sound', on: boolean) => {
    if (type === 'Sound') {
      setSoundEnabled(on)
      const videoElements = document.querySelectorAll('video')
      videoElements.forEach((video) => {
        if (video.id === 'remote') {
          video.muted = on ? false : true
        }
      })
      return
    }

    if (stream) {
      stream[`get${type}Tracks`]().forEach((track) => {
        track.enabled = on
        type === 'Audio' ? setIsAudioEnabled(on) : setIsVideoEnabled(on)
      })
    }
  }

  useEffect(() => {
    start()

    return () => {
      stream?.getTracks().forEach((track) => track.stop())
    }
  }, [])

  useEffect(() => {
    //save user settings
    if (stream)
      window.localStorage.setItem(
        'echomingle_media_settings',
        JSON.stringify({
          audioEnabled: isAudioEnabled,
          videoEnabled: isVideoEnabled,
          soundEnabled: !soundEnabled,
        }),
      )
  }, [isAudioEnabled, isVideoEnabled, soundEnabled])

  return {
    stream,
    start,
    toogle,
    audioEnabled: stream?.getAudioTracks()[0]?.enabled,
    videoEnabled: stream?.getVideoTracks()[0]?.enabled,
    soundEnabled,
  }
}
