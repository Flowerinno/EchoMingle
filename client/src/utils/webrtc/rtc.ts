const PC_CONFIG = {
  iceServers: [{ urls: ['stun:stun.l.google.com:19302'] }],
}

export function createPeerConnection() {
  return new RTCPeerConnection(PC_CONFIG)
}

export async function createOffer(peerConnection: RTCPeerConnection) {
  const sdp = await peerConnection.createOffer()
  await peerConnection.setLocalDescription(sdp)
}

export async function createAnswer(
  peerConnection: RTCPeerConnection,
  offer: RTCSessionDescriptionInit,
) {
  await peerConnection.setRemoteDescription(new RTCSessionDescription(offer))
  const answer = await peerConnection.createAnswer()
  await peerConnection.setLocalDescription(answer)
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
    peerConnection.close()
    setPc(null)
  }
}
