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
        console.log('SENT OFFER - 1 to ' + remoteUser.email)
        socket.emit('send_offer', {
          room_id: roomId,
          name: remoteUser.name,
          remote_user_id: remoteUser.user_id,
          local_user_id: localUserId,
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

    // socket.on('client_disconnected', ({ user_id }) => {
    //   if (user_id === remoteUser.user_id) {
    //     closeConnection(pc, setPc)
    //   }
    // })

    socket.on('on_remote_connected', (data) => {
      if (data?.connected_clients?.length === 0 || localUserId !== data?.user_id) {
        return
      }
      sendOffer()
    })

    //remote_user_ud = LOCAL ID USER
    //local_user_id = REMOTE ID USER

    socket.on('incoming_offer', async ({ offer, remote_user_id, local_user_id, to }) => {
      if (
        !offer ||
        remote_user_id !== localUserId ||
        local_user_id !== remoteUser.user_id ||
        !pc ||
        !localStream
      )
        return

      const answer = await createAnswer(pc, offer).catch((e) => e)

      if (answer) {
        console.log('CREATE ANSWER - 2 to ', remoteUser.email)
        socket.emit('answer_to_offer', {
          room_id: roomId,
          answer,
          to,
          remote_user_id: remoteUser.user_id,
          local_user_id: localUserId,
        })
        await pc.setLocalDescription(answer)
      }
    })

     //remote_user_ud = LOCAL ID USER
    //local_user_id = REMOTE ID USER
    socket.on('server_answer', async ({ answer, remote_user_id, local_user_id }) => {
      if (
        remote_user_id !== localUserId ||
        local_user_id !== remoteUser.user_id ||
        pc?.signalingState === 'stable'
      ) {
        return
      }

      if (answer && pc && localStream) {
        console.log('RECEIVED ANSWER - 3 from ' + remoteUser.email)
        const remoteDesc = new RTCSessionDescription(answer)
        await pc.setRemoteDescription(remoteDesc).catch((e) => e)
      }
    })

    if (pc) {
      pc.onicecandidate = ({ candidate }) => {
        if (candidate) {
          console.log('GOT CANDIDATE for ' + remoteUser.email)
          socket.emit('candidate', {
            room_id: roomId,
            candidate,
            remote_user_id: remoteUser.user_id,
            local_user_id: localUserId,
          })
        }
      }
    }

    socket.on('server_candidate', async ({ candidate, remote_user_id, local_user_id }) => {
      if (
        remote_user_id !== localUserId ||
        local_user_id !== remoteUser.user_id ||
        !candidate ||
        !pc
      ) {
        return
      }
      console.log('SET CANDIDATE - 4 for ' + remoteUser.email)
      const newCandidate = new RTCIceCandidate(candidate)
      await pc.addIceCandidate(newCandidate).catch((e) => {
        console.log('Error adding ice candidate', e)
      })
    })
  }, [localStream])

  return { pc, remoteStream }
}
