# Welcome to `EchoMingle`

[EchoMingle website](https://echomingle.pages.dev)

This is a simple project for a live video chat application. It is built using the `WebRTC` technology.

For those who struggling:

- [WebRTC](https://webrtc.org/) is a free, open-source project that provides web browsers and mobile applications with real-time communication (RTC) via simple application programming interfaces (APIs).
- [Socket.io](https://socket.io/) is a library that enables real-time, bidirectional and event-based communication between web clients and servers.

## WebRTC

## Description

1. **getUserMedia**: The `getUserMedia` method prompts the user for permission to use a media input which produces a MediaStream with tracks containing the requested types of media.
2. **RTCPeerConnection**: The `RTCPeerConnection` interface represents a WebRTC connection between the local computer and a remote peer. It provides methods to connect to a remote peer, maintain and monitor the connection, and close the connection once it's no longer needed.

## WebRTC Flow

1. **Signaling**: Exchange of information to establish a connection. This can be done using `Socket.io` or any other method.
2. **Offer**: The `RTCPeerConnection` creates an `offer` which includes information about any MediaStream tracks attached to the connection, codec and media format information, and any other metadata that describes the media to be sent.
3. **Answer**: The `offer` is sent to the remote peer using the signaling server. The remote peer receives the `offer` and creates an `answer` which it sends back to the caller.
4. **ICE**: The `RTCPeerConnection` uses the `ICE (Interactive Connectivity Establishment) ` framework to find the best path for media to travel between the peers. This includes finding the public IP address of the peer and the port that the media is being sent to.
5. **Media**: Once the `offer` and `answer` are exchanged, the `ICE` framework has found a path for the media, and the peers have agreed on the codec and media format to use, the media begins to flow between the peers.

# `WARNING`: This project is still under development and hosted for free on [Cloudflare Pages](https://pages.cloudflare.com/) and [Render](https://render.com/). The free tier has limits. If the limit is reached, the website will be temporarily disabled. If you encounter any issues, please try again later. The website may be slow to load due to the free tier limitations and has 50 seconds of startup time if inactive (a.k.a no calls to backend).

# TURN/STURN server

Hosted on [metered.ca](https://www.metered.ca/)
