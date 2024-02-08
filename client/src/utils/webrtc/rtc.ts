const PC_CONFIG = {
  iceServers: [{ urls: ['stun:stun.l.google.com:19302'] }],
}

export function createPeerConnection() {
  return new RTCPeerConnection(PC_CONFIG)
}

export async function createOffer(peerConnection: RTCPeerConnection) {
  const sdp = await peerConnection.createOffer()
  await peerConnection.setLocalDescription(sdp)

  return sdp
}

export async function createAnswer(
  peerConnection: RTCPeerConnection,
  offer: RTCSessionDescriptionInit,
) {
  peerConnection.setRemoteDescription(new RTCSessionDescription(offer))

  const answer = await peerConnection.createAnswer()
  await peerConnection.setLocalDescription(answer)

  return answer
}

export function addTracks(peerConnection: RTCPeerConnection, stream: MediaStream) {
  stream.getTracks().forEach((track) => {
    if (!peerConnection.getSenders().some((sender) => sender.track === track)) {
      peerConnection.addTrack(track, stream)
    }
  })
}

export function registerPeerConnectionListeners(peerConnection: RTCPeerConnection) {
  peerConnection.addEventListener('connectionstatechange', (event) => {
    console.log(`Connection state change: ${peerConnection.connectionState}`)
  })
}
