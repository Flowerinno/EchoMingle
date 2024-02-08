import { socket } from '@/lib/ws'
import {
  addTracks,
  createAnswer,
  createOffer,
  createPeerConnection,
  registerPeerConnectionListeners,
} from '@/utils/webrtc'
import { useEffect, useRef } from 'react'

export const usePeerConnection = (
  roomId: string,
  localStream: MediaStream | null,
  user: {
    user_id: string
    name: string
    email: string
  },
  localUserId: string,
) => {
  const pc = useRef(createPeerConnection())
  registerPeerConnectionListeners(pc.current)
  const isConnected = pc.current.connectionState === 'connected'

  //user joined the room sends and 'CONNECT_TO_ROOM' event and gets back ON_CONNECT
  // event which will trigger sendOffer function.
  const sendOffer = () => {
    if (!localStream) return

    createOffer(pc.current).then((offer) => {
      if (offer) {
        console.log('STEP 2 - SENDING OFFER FOR REMOTE ', user.user_id)
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
    if (pc.current.connectionState === 'failed') {
      sendOffer()
    }
  }, [pc.current.connectionState])

  useEffect(() => {
    if (!pc.current || !localStream) return

    addTracks(pc.current, localStream)

    socket.on('joined_room', (data) => {
      if (data.user_id !== localUserId || data.connected_users === 1 || isConnected) {
        return
      }
      console.log('STEP 1 - JOIN THE ROOM', data.user_id + ' ' + data.name)
      sendOffer()
    })

    socket.on('incoming_offer', async ({ offer, user_id, to }) => {
      if (!offer || user_id !== localUserId) return
      console.log('STEP - 3 - IncomingOffer from ' + user_id + ' to ' + user.email)

      if (isConnected) return

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
      console.log('STEP - 4 - ServerAnswer', answer)
      if (answer) {
        const remoteDesc = new RTCSessionDescription(answer)
        await pc.current.setRemoteDescription(remoteDesc)
      }
    })

    pc.current.onicecandidate = ({ candidate }) => {
      if (candidate) {
        socket.emit('candidate', { room_id: roomId, candidate, user_id: user.user_id })
      }
    }

    socket.on('server_candidate', async ({ candidate, user_id }) => {
      if (user_id !== localUserId) return
      if (candidate) {
        await pc.current.addIceCandidate(candidate)
      }
    })

    socket.on('client_disconnected', ({ user_id }) => {
      if (user_id === user.user_id) {
        console.log('closing connection for ', user_id)
      }
    })

    return () => {
      socket.off('offer_to_empty_room')
      socket.off('incoming_offer')
      socket.off('server_answer')
      socket.off('server_candidate')
      socket.off('client_disconnected')
    }
  }, [pc.current])

  return { pc: pc.current, sendOffer }
}
