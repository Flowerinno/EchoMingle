const PC_CONFIG = {
  iceServers: [{ urls: ['stun:stun.l.google.com:19302'] }],
  canTrickleIceCandidates: true,
}
export function createPeerConnection() {
  return new RTCPeerConnection(PC_CONFIG)
}

export async function createOffer(peerConnection: RTCPeerConnection, stream: MediaStream) {
  stream.getTracks().forEach((track) => peerConnection.addTrack(track, stream))

  const sdp = await peerConnection.createOffer({
    offerToReceiveAudio: true,
    offerToReceiveVideo: true,
  })

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

export function registerPeerConnectionListeners(peerConnection: RTCPeerConnection) {
  peerConnection.addEventListener('icegatheringstatechange', () => {
    console.log(`ICE gathering state changed: ${peerConnection.iceGatheringState}`)
  })

  peerConnection.addEventListener('connectionstatechange', (event) => {
    console.log(`Connection state change: ${peerConnection.connectionState}`)
  })

  peerConnection.addEventListener('signalingstatechange', () => {
    console.log(`Signaling state change: ${peerConnection.signalingState}`)
  })

  peerConnection.addEventListener('iceconnectionstatechange ', (e) => {
    console.log(e)
    console.log(`ICE connection state change: ${peerConnection.iceConnectionState}`)
  })
}
