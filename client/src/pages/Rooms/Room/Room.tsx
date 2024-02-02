import { Media } from '@/components'
import { useMediaDevice } from '@/hooks/useMediaDevice'
import { socket } from '@/lib/ws'
import { ERoutes } from '@/routes'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

type Settings = {
  audioEnabled: boolean
  videoEnabled: boolean
  soundEnabled: boolean
}

export const Room = () => {
  const { t } = useTranslation('room')
  const [clients, setClients] = useState<string[]>([])
  const navigate = useNavigate()
  const [message, setMessage] = useState('')
  const roomId = window.location.pathname.split('rooms/')[1]

  const cache = JSON.parse(
    window.localStorage.getItem('echomingle_media_settings') as string,
  ) as Settings

  const { stream, toogle, audioEnabled, videoEnabled, soundEnabled } = useMediaDevice({
    isAutoStart: true,
    cache,
  })

  socket.on('onError', (data) => {
    setMessage('')
    setMessage(data.message)
    return
  })

  useEffect(() => {
    if (!roomId) {
      navigate(ERoutes.home)
    }
    socket.connect()

    return () => {
      socket.disconnect()
    }
  }, [])

  useEffect(() => {
    socket.on('connection', (sockets) => {
      setClients(() => sockets)
      return
    })

    return () => {
      socket.off('connection')
    }
  }, [clients.length])

  socket.on('server_stream', (data) => {
    console.log(data)
  })

  useEffect(() => {
    socket.emit('stream', { room_id: roomId, stream, audioEnabled, videoEnabled, soundEnabled })
  }, [stream])

  return (
    <div className='flex flex-col gap-5 items-center justify-start min-h-screen'>
      <Media
        isAutoStart
        isLocal
        toogle={toogle}
        audioEnabled={audioEnabled}
        videoEnabled={videoEnabled}
        soundEnabled={soundEnabled}
        stream={stream}
      />
      {message && <p className='text-red-300'>{message}</p>}
    </div>
  )
}
