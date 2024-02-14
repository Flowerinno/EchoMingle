export function createPeerConnection(iceServers: RTCIceServer[] | null = []) {
  const SERVERS = iceServers?.length ? iceServers : [{ urls: ['stun:stun.l.google.com:19302'] }]

  const PC_CONFIG = {
    iceServers: SERVERS,
  }
  return new RTCPeerConnection(PC_CONFIG)
}

export async function createOffer(peerConnection: RTCPeerConnection) {
  const offer = await peerConnection.createOffer()
  await peerConnection.setLocalDescription(offer)
  return offer
}

export async function createAnswer(
  peerConnection: RTCPeerConnection,
  offer: RTCSessionDescriptionInit,
) {
  await peerConnection.setRemoteDescription(new RTCSessionDescription(offer))
  const answer = await peerConnection.createAnswer()
  return answer
}

export function addTracks(peerConnection: RTCPeerConnection, stream: MediaStream) {
  stream.getTracks().forEach((track) => {
    if (!peerConnection.getSenders().some((sender) => sender.track === track)) {
      peerConnection.addTrack(track, stream)
    }
  })
}

export function registerPeerConnectionListeners(peerConnection: RTCPeerConnection | null) {
  if (peerConnection)
    peerConnection.addEventListener('connectionstatechange', () => {
      switch (peerConnection.connectionState) {
        case 'connected':
          console.log('Connection established!')
          break
        case 'failed':
          console.log('Failed')
          break
        case 'disconnected':
          console.log('Disconnected')
          break
        case 'closed':
          console.log('Closed')
          break
        case 'connecting':
          console.log('Connecting')
          break
        default:
          break
      }
    })
}

export function closeConnection(
  peerConnection: RTCPeerConnection | null,
  setPc: (pc: RTCPeerConnection | null) => void,
) {
  if (peerConnection) {
    peerConnection.ontrack = null
    //@ts-expect-error
    peerConnection.removeTrack = null
    peerConnection.onicecandidate = null
    peerConnection.oniceconnectionstatechange = null
    peerConnection.onsignalingstatechange = null
    peerConnection.onicegatheringstatechange = null
    peerConnection.onnegotiationneeded = null
    peerConnection.onconnectionstatechange = null
    peerConnection.close()
    setPc(null)
  }
}
