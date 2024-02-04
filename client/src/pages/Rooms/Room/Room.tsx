import { Media } from '@/components'
import { ToastifyRoot } from '@/features'
import { useMediaDevice } from '@/hooks/useMediaDevice'
import { socket } from '@/lib/ws'
import { ERoutes } from '@/routes'
import { VerifyResponse } from '@/types/auth.types'
import {
  createAnswer,
  createOffer,
  createPeerConnection,
  registerPeerConnectionListeners,
} from '@/utils/webrtc'
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router'

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
  const navigate = useNavigate()
  const user = useOutletContext<VerifyResponse>()
  const roomId = window.location.pathname.split('rooms/')[1]
  const [STREAMS, setSTREAMS] = useState<any>([])

  const cache = JSON.parse(
    window.localStorage.getItem('echomingle_media_settings') as string,
  ) as Settings
  const remoteRef = useRef<HTMLVideoElement>(null)
  const pc = useRef(createPeerConnection())
  registerPeerConnectionListeners(pc.current)

  if (pc.current) {
    pc.current.oniceconnectionstatechange = (e) => {
      if (pc.current.iceConnectionState === 'connected') {
        console.log('ICE CONNECTION STATE CHANGE', pc.current.iceConnectionState)
      }
      if (pc.current.iceConnectionState === 'disconnected') {
        console.log('ICE CONNECTION STATE CHANGE', pc.current.iceConnectionState)
      }
    }
  }

  useEffect(() => {
    if (!roomId) {
      navigate(ERoutes.home)
    }
    socket.connect()

    return () => {
      socket.disconnect()
    }
  }, [roomId])

  const { stream, toogle, audioEnabled, videoEnabled, soundEnabled } = useMediaDevice({
    isAutoStart: true,
    cache,
  })

  socket.on('onError', (data) => {
    if (!data?.message) return
    ToastifyRoot.error(data.message)
  })

  socket.on('new_client', (data) => {
    if (!data.socket_id) return
    if (!stream) return
  })

  useEffect(() => {
    if (!stream) return

    createOffer(pc.current, stream).then((offer) => {
      if (pc.current.localDescription) {
        socket.emit('offer', {
          room_id: roomId,
          offer,
        })
      }
    })
  }, [stream])

  socket.on('answer_to_offer', async (data) => {
    if (!data.answer) return
    if (!stream) return

    const answer = await createAnswer(pc.current, data.answer)

    socket.emit('answer', {
      room_id: roomId,
      answer,
    })
  })

  socket.on('server_answer', async (data) => {
    if (!data.answer) return

    const remoteDesc = new RTCSessionDescription(data.answer)
    await pc.current.setRemoteDescription(remoteDesc)
  })

  pc.current.onicecandidate = ({ candidate }) => {
    if (!candidate) return
    socket.emit('candidate', { room_id: roomId, candidate })
  }

  socket.on('server_candidate', async ({ candidate }) => {
    if (!candidate) return

    await pc.current.addIceCandidate(candidate)
  })

  useEffect(() => {
    pc.current.ontrack = (event) => {
      const stream = event.streams[0]

      if (remoteRef.current) {
        remoteRef.current.srcObject = stream
      }

      setSTREAMS(() => [stream])
    }
  }, [STREAMS.length])
  console.log(STREAMS)
  return (
    <div className='flex flex-row flex-wrap gap-5 items-start justify-center min-h-screen'>
      <Media
        isAutoStart
        isLocal
        toogle={toogle}
        audioEnabled={audioEnabled}
        videoEnabled={videoEnabled}
        soundEnabled={soundEnabled}
        stream={stream}
      />

      {
        STREAMS.length > 0 && (
          // STREAMS.map((stream, i) => {
          //   return (
          <Media
            // key={i}
            stream={STREAMS[0]}
            audioEnabled={true}
            videoEnabled={true}
            soundEnabled={true}
            isAutoStart
            message='REMOTE'
          />
        )
        // )
      }
    </div>
  )
}
