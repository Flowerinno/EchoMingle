import { socket } from '@/lib/ws'
import {
  addTracks,
  closeConnection,
  createAnswer,
  createOffer,
  createPeerConnection,
  registerPeerConnectionListeners,
} from '@/utils/webrtc'
import { useEffect, useState } from 'react'

export const usePeerConnection = (
  roomId: string,
  localStream: MediaStream | null,
  remoteUser: {
    user_id: string
    name: string
    email: string
  },
  localUserId: string,
  iceServers: RTCIceServer[] | null,
) => {
  const [pc, setPc] = useState<RTCPeerConnection | null>(createPeerConnection(iceServers))
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null)

  const sendOffer = async () => {
    if (pc) {
      const offer = await createOffer(pc).catch((e) => console.log('Error creating offer', e))

      if (offer) {
        console.log('SENT OFFER - 1')
        socket.emit('send_offer', {
          room_id: roomId,
          name: remoteUser.name,
          user_id: remoteUser.user_id,
          offer,
        })
      }
    }
  }

  const handleRemoteStream = (event: RTCTrackEvent) => {
    const stream = event.streams[0]
    setRemoteStream(stream)
  }

  useEffect(() => {
    if (pc && localStream) {
      addTracks(pc, localStream)
    }

    if (pc && localStream) {
      registerPeerConnectionListeners(pc)
      pc.ontrack = handleRemoteStream
    }

    socket.on('client_disconnected', ({ user_id }) => {
      if (user_id === remoteUser.user_id) {
        closeConnection(pc, setPc)
      }
    })

    socket.on('on_remote_connected', (data) => {
      if (data?.connected_clients?.length === 0 || localUserId !== data?.user_id) {
        return
      }
      sendOffer()
    })

    socket.on('incoming_offer', async ({ offer, user_id, to }) => {
      if (!offer || user_id !== localUserId || !pc || !localStream) return

      const answer = await createAnswer(pc, offer).catch((e) => e)

      if (answer) {
        console.log('CREATE ANSWER - 2')
        socket.emit('answer_to_offer', {
          room_id: roomId,
          answer,
          to,
          user_id: remoteUser.user_id,
        })
        await pc.setLocalDescription(answer)
      }
    })

    socket.on('server_answer', async ({ answer, user_id }) => {
      if (user_id !== localUserId || pc?.signalingState === 'stable') return

      if (answer && pc && localStream) {
        console.log('RECEIVED ANSWER - 3')
        const remoteDesc = new RTCSessionDescription(answer)
        await pc.setRemoteDescription(remoteDesc).catch((e) => e)
      }
    })

    if (pc) {
      pc.onicecandidate = ({ candidate }) => {
        if (candidate) {
          console.log('GOT CANDIDATE')
          socket.emit('candidate', { room_id: roomId, candidate, user_id: remoteUser.user_id })
        }
      }
    }

    socket.on('server_candidate', async ({ candidate, user_id }) => {
      if (user_id !== localUserId || !candidate || !pc) {
        return
      }
      console.log('SET CANDIDATE - 4')
      const newCandidate = new RTCIceCandidate(candidate)
      await pc.addIceCandidate(newCandidate).catch((e) => {
        console.log('Error adding ice candidate', e)
      })
    })
  }, [localStream])

  return { pc, remoteStream }
}
