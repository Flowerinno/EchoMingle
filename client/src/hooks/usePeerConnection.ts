import { socket } from '@/lib/ws'
import {
  addTracks,
  createAnswer,
  createOffer,
  createPeerConnection,
  registerPeerConnectionListeners,
} from '@/utils/webrtc'
import { useEffect, useRef, useState } from 'react'

export const usePeerConnection = (
  roomId: string,
  localStream: MediaStream | null,
  user: {
    user_id: string
    name: string
  },
  localUserId: string,
) => {
  const boundRemoteSocket = useRef<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  const pc = useRef(createPeerConnection())
  registerPeerConnectionListeners(pc.current)

  const acceptUserToCall = () => {
    if (!localStream) return

    createOffer(pc.current).then((offer) => {
      if (offer) {
        console.log('SENDING OFFER FOR REMOTE ', user.user_id)
        socket.emit('send_offer', {
          room_id: roomId,
          name: user.name,
          user_id: user.user_id,
          offer,
        })
      }
    })
  }

  useEffect(() => {
    if (!pc.current || !localStream) return

    addTracks(pc.current, localStream)

    socket.on('offer_to_empty_room', () => {
      console.log('offer_to_empty_room')
    })

    socket.on('incoming_offer', async ({ offer, user_id, to }) => {
      console.log('INCOMING OFFER FOR ', user_id, 'MY LOCAL ID ', localUserId)
      if (!offer) return
      if (user_id !== localUserId) return
      console.log('IncomingOffer', offer)
      const answer = await createAnswer(pc.current, offer)

      if (!answer) return
      socket.emit('answer_to_offer', {
        room_id: roomId,
        answer,
        to,
        user_id: user.user_id,
      })
    })

    socket.on('server_answer', async ({ answer, user_id }) => {
      if (user_id !== localUserId) return
      console.log('ServerAnswer', answer)
      if (answer) {
        const remoteDesc = new RTCSessionDescription(answer)
        await pc.current.setRemoteDescription(remoteDesc)
      }
    })

    pc.current.onicecandidate = ({ candidate }) => {
      if (candidate) {
        socket.emit('candidate', { room_id: roomId, candidate })
      }
    }

    socket.on('server_candidate', async ({ candidate }) => {
      if (candidate) {
        await pc.current.addIceCandidate(candidate)
      }
    })

    // socket.on('client_disconnected', ({ socket_id }) => {
    //   if (socket_id === boundRemoteSocket.current) {
    //     pc.current.ontrack = null
    //     pc.current.setLocalDescription(undefined)
    //     pc.current.restartIce()
    //   }
    // })

    return () => {
      socket.off('offer_to_empty_room')
      socket.off('incoming_offer')
      socket.off('server_answer')
      socket.off('server_candidate')
      socket.off('client_disconnected')
      pc.current.onicecandidate = null
      pc.current.ontrack = null
    }
  }, [pc.current, localStream])

  return { pc: pc.current, acceptUserToCall }
}
