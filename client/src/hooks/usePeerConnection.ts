import { socket } from '@/lib/ws'
import {
  addTracks,
  closeConnection,
  createAnswer,
  createOffer,
  createPeerConnection,
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
) => {
  const [pc, setPc] = useState<RTCPeerConnection | null>(createPeerConnection())

  const sendOffer = async () => {
    if (pc && localStream) {
      addTracks(pc, localStream)
      await createOffer(pc).catch((e) => e)

      if (pc.localDescription) {
        console.log('SENT OFFER - 1')
        socket.emit('send_offer', {
          room_id: roomId,
          name: remoteUser.name,
          user_id: remoteUser.user_id,
          offer: pc.localDescription,
        })
      }
    }
  }

  useEffect(() => {
    if (pc) {
      pc.addEventListener('connectionstatechange', () => {
        switch (pc.connectionState) {
          case 'connected':
            console.log('Connection established!')
            break
          case 'failed':
            setPc(createPeerConnection())
            break
          case 'disconnected':
            console.log('Disconnected')
            break
          case 'closed':
            setPc(createPeerConnection())
            break
          case 'connecting':
            console.log('Connecting')
            break
          default:
            break
        }
      })
    }

    socket.on('on_remote_connected', (data) => {
      if (data?.connected_clients?.length === 0 || localUserId !== data?.user_id) {
        return
      }
      sendOffer()
    })

    socket.on('incoming_offer', async ({ offer, user_id, to }) => {
      if (!offer || user_id !== localUserId || !pc || !localStream) return

      addTracks(pc, localStream)
      await createAnswer(pc, offer).catch((e) => e)
      console.log('CREATE ANSWER - 2')
      if (pc.localDescription)
        socket.emit('answer_to_offer', {
          room_id: roomId,
          answer: pc.localDescription,
          to,
          user_id: remoteUser.user_id,
        })
    })

    socket.on('server_answer', async ({ answer, user_id }) => {
      if (user_id !== localUserId || pc?.signalingState === 'stable') return

      if (answer && pc) {
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
      if (user_id !== localUserId || !candidate || !pc || !pc.remoteDescription) {
        return
      }
      console.log('SET CANDIDATE - 4')
      const newCandidate = new RTCIceCandidate(candidate)
      await pc.addIceCandidate(newCandidate).catch((e) => {
        console.log('Error adding ice candidate', e)
      })
    })

    return () => {
      closeConnection(pc, setPc)
    }
  }, [
    pc?.localDescription,
    pc?.remoteDescription,
    pc?.signalingState,
    pc?.onconnectionstatechange,
    pc?.onicecandidate,
    localStream,
    localUserId,
    remoteUser.user_id,
    roomId,
    sendOffer,
  ])

  return { pc, sendOffer }
}
