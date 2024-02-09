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
    email: string
  },
  localUserId: string,
  adminEmail: string,
  localEmail: string,
) => {
  const [isOfferSent, setIsOfferSent] = useState(false)
  const pc = useRef<RTCPeerConnection>(createPeerConnection())

  if (pc.current !== null) {
    registerPeerConnectionListeners(pc.current)
  }
  const isConnected = pc?.current?.connectionState === 'connected'

  //user joined the room sends and 'CONNECT_TO_ROOM' event and gets back ON_CONNECT
  // event which will trigger sendOffer function.
  const sendOffer = async () => {
    try {
      if (adminEmail === localEmail && !isOfferSent) {
        console.log('STEP 2 - CREATE OFFER ON RENDER IF ADMIN')
        createOffer(pc.current).then((offer) => {
          console.log('STEP 3 - SENDING OFFER FOR REMOTE ', user.user_id)
          socket.emit('send_offer', {
            room_id: roomId,
            name: user.name,
            user_id: user.user_id,
            offer,
          })
          setIsOfferSent(true)
        })
      }
    } catch (error) {
      console.log('IN STEP 2', error)
    }
  }

  useEffect(() => {
    if (!pc.current || !localStream) return

    addTracks(pc.current, localStream)

    socket.on('new_client', (data) => {
      if (data?.adminEmail !== localEmail || data.user_id === localUserId) {
        return //only admin is initiating the call
      }
      console.log('STEP 1 - USER JOINED THE ROOM', data.user_id + ' ' + data.name)
      sendOffer()
      setIsOfferSent(true)
    })

    socket.on('incoming_offer', async ({ offer, user_id, to }) => {
      console.log('STEP 4 - IncomingOffer from ' + user_id + ' to ' + user.email)
      if (!offer || user_id !== localUserId) return

      if (isConnected || !pc.current) return

      try {
        const answer = await createAnswer(pc.current, offer)

        if (!answer) return
        socket.emit('answer_to_offer', {
          room_id: roomId,
          answer,
          to,
          user_id: user.user_id,
        })
      } catch (error) {
        console.log(error)
      }
    })

    socket.on('server_answer', async ({ answer, user_id }) => {
      if (user_id !== localUserId) return
      console.log('STEP 5 - ServerAnswer', answer)
      if (answer && pc?.current) {
        try {
          const remoteDesc = new RTCSessionDescription(answer)
          await pc.current.setRemoteDescription(remoteDesc)
        } catch (error) {
          pc.current.restartIce()
        }
      }
    })

    pc.current.onicecandidate = ({ candidate }) => {
      if (candidate) {
        socket.emit('candidate', { room_id: roomId, candidate, user_id: user.user_id })
      }
    }

    socket.on('server_candidate', async ({ candidate, user_id }) => {
      if (user_id !== localUserId) return
      if (candidate && pc?.current) {
        await pc.current.addIceCandidate(candidate)
      }
    })

    socket.on('client_disconnected', ({ user_id }) => {
      if (user_id === user.user_id) {
        //@ts-expect-error
        pc.current = null
      }
    })
  }, [pc.current])

  return { pc: pc.current, sendOffer }
}
