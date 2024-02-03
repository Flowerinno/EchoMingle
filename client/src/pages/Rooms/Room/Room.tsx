import { Media } from '@/components'
import { ToastifyRoot } from '@/features'
import { useMediaDevice } from '@/hooks/useMediaDevice'
import { socket } from '@/lib/ws'
import { ERoutes } from '@/routes'
import { addIceCandidate, createAnswer, createOffer, createPeerConnection } from '@/utils/webrtc'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

type Settings = {
  audioEnabled: boolean
  videoEnabled: boolean
  soundEnabled: boolean
}

type Client = {
  id: string
  audioEnabled: boolean
  videoEnabled: boolean
  soundEnabled: boolean
  stream: MediaStream
}

export const Room = () => {
  const { t } = useTranslation('room')
  const [clients, setClients] = useState<Client[] | []>([])
  const navigate = useNavigate()
  const roomId = window.location.pathname.split('rooms/')[1]

  const cache = JSON.parse(
    window.localStorage.getItem('echomingle_media_settings') as string,
  ) as Settings

  const pc = useRef(createPeerConnection())

  useEffect(() => {
    if (!roomId) {
      navigate(ERoutes.home)
    }
    socket.connect()

    return () => {
      socket.disconnect()
    }
  }, [])

  const { stream, toogle, audioEnabled, videoEnabled, soundEnabled } = useMediaDevice({
    isAutoStart: true,
    cache,
  })

  socket.on('onError', (data) => {
    if (!data?.message) return
    ToastifyRoot.error(data.message)
  })

  useEffect(() => {
    if (!stream) return

    createOffer(pc.current, stream)

    if (pc.current.localDescription) {
      socket.emit('offer', {
        room_id: roomId,
        offer: pc.current.localDescription,
      })
    }
  }, [stream])

  socket.on('answer_to_offer', (data) => {
    if (!data.answer) return
    if (!stream) return

    createAnswer(pc.current, stream, data.answer)

    socket.emit('answer', {
      room_id: roomId,
      answer: pc.current.localDescription,
    })
  })

  socket.on('server_answer', (data: any) => {
    if (!data.answer) return
    pc.current.setRemoteDescription(new RTCSessionDescription(data.answer))
  })

  pc.current.onicecandidate = ({ candidate }) => {
    if (!candidate) return
    socket.emit('candidate', { room_id: roomId, candidate })
  }

  socket.on('server_candidate', (data: any) => {
    if (!data.candidate) return
    addIceCandidate(pc.current, data.candidate)
  })

  pc.current.ontrack = (event) => {
    const stream = event.streams[0]
    const client = {
      id: event.track.id,
      audioEnabled: true,
      videoEnabled: true,
      soundEnabled: true,
      stream,
    }

    const copy = [...clients]
    copy.push(client)

    setClients(() => [...new Set(copy)])
  }

  return (
    <div className='flex flex-row flex-wrap gap-5 items-start justify-start min-h-screen'>
      <Media
        isAutoStart
        isLocal
        toogle={toogle}
        audioEnabled={audioEnabled}
        videoEnabled={videoEnabled}
        soundEnabled={soundEnabled}
        stream={stream}
      />
      {clients.length > 0 &&
        clients.map((client) => {
          return (
            <Media
              key={client.id}
              stream={client.stream}
              audioEnabled={true}
              videoEnabled={true}
              soundEnabled={true}
              isAutoStart
              isLocal={false}
            />
          )
        })}
    </div>
  )
}
