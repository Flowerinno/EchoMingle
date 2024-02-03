export function createPeerConnection() {
  return new RTCPeerConnection({
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
  })
}

export async function createOffer(peerConnection: RTCPeerConnection, stream: MediaStream) {
  if (!stream) return

  stream.getTracks().forEach((track) => peerConnection.addTrack(track, stream))

  const sdp = await peerConnection.createOffer()

  peerConnection.setLocalDescription(sdp)
}

export async function createAnswer(
  peerConnection: RTCPeerConnection,
  stream: MediaStream,
  msg: RTCSessionDescriptionInit,
) {
  if (!stream) return

  if (peerConnection.signalingState !== 'stable') return

  await peerConnection.setRemoteDescription(new RTCSessionDescription(msg))

  stream.getTracks().forEach((track) => peerConnection.addTrack(track, stream))

  const sdp = await peerConnection.createAnswer()

  peerConnection.setLocalDescription(sdp)
}

export async function addIceCandidate(peerConnection: RTCPeerConnection, msg: any) {
  if (peerConnection.remoteDescription === null) return
  
  const candidate = new RTCIceCandidate(msg)
  await peerConnection.addIceCandidate(candidate)
}
