import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { io, Socket } from 'socket.io-client';
import { ChatRoomComponent } from './chat-room/chat-room.component';
import { VideoChatRoomComponent } from './video-chat-room/video-chat-room.component';

@Component({
  selector: 'app-room-detail',
  templateUrl: './room-detail.component.html',
  styleUrls: ['./room-detail.component.css']
})
export class RoomDetailComponent implements OnInit {

  @ViewChild('localVideoComponent') localVideoComponent: VideoChatRoomComponent;
  @ViewChild('remoteVideoComponent') remoteVideoComponent: VideoChatRoomComponent;
  @ViewChild('chatComponent') chatComponent: ChatRoomComponent;

  private socketIoServer = 'http://20.151.0.119:3002';
  private mediaStreamOption = {
    'video': true,
    'audio': true
  };
  private iceServerOption = {
    'iceServers': [
      {
        urls: 'stun:stun.l.google.com:19302',
      },
      {
        urls: 'turn:20.151.0.119:3478',
        username: null,
        credential: null
      }
    ]
  };

  callerId: string;
  receiverId: string;

  socket: Socket;
  private peerConnection: RTCPeerConnection;

  localStream: MediaStream;
  remoteStream: MediaStream;

  remoteOffer: any;

  constructor(private activatedRoute: ActivatedRoute) {
    this.socket = io(this.socketIoServer);
    this.remoteStream = new MediaStream();

    this.activatedRoute.params.subscribe(params => {
      let roomId = params['id'];
      this.callerId = 'ccea7333-289d-4b07-9fa6-00284cdaa985';
      this.receiverId = roomId;
    });

    navigator.mediaDevices.getUserMedia(this.mediaStreamOption).then((stream) => {
      this.localStream = stream;
      this.localVideoComponent.play(stream);
      this.addTracks();
    }).catch((err) => {
      console.log('Could not initialize local stream', err);
    });

    this.peerConnection = new RTCPeerConnection(this.iceServerOption);

    // this.setTestValues();
    this.configureSocketListeners();
    this.configurePeerConnectionListeners();
  }

  addTracks() {
    try {
      this.localStream.getTracks().forEach(track => {
        this.peerConnection.addTrack(track, this.localStream);
        console.log('Added track to peer connection', track.kind);
      })
    } catch (error) {
      console.error('Could not track to peer connection', error);
    }
  }

  configureSocketListeners(): void {
    this.socket.on('connect', async () => {
      console.log('Socket connection established');
      this.socket.emit('join-room', this.callerId, 'Vasnani');
    });

    this.socket.on('offer', (offer) => {
      this.remoteOffer = offer;
    })

    this.socket.on('call-accept', message => {
      if (message) {
        console.log('Call answered', message);
        const remoteDesc = new RTCSessionDescription(message);
        this.peerConnection.setRemoteDescription(remoteDesc).then(() => {
          console.log('Remote description set');
        }).catch((err) => {
          console.log(err);
        });
      }
    });

    // Listen for remote ICE candidates and add them to the local RTCPeerConnection
    this.socket.on('new-ice-candidate', async iceCandidate => {
      console.log('New candidate found', iceCandidate);
      if (iceCandidate) {
        try {
          await this.peerConnection.addIceCandidate(iceCandidate);
        } catch (e) {
          console.error('Error adding received ice candidate', e);
        }
      }
    });

    this.socket.on('message', (data) => {
      this.chatComponent.push(data.message, false);
    });
  }

  configurePeerConnectionListeners(): void {
    // Listen for connectionstatechange on the local RTCPeerConnection
    this.peerConnection.addEventListener('connectionstatechange', event => {
      console.log('RTC connection state changed', event);
      if (this.peerConnection.connectionState === 'connected') {
        // Peers connected!
        console.log('Peers connected');
      }
    });

    // Add remote video track
    this.peerConnection.addEventListener('track', async (event) => {
      console.log('Stream received from the other side', event.track.kind);
      this.remoteStream.addTrack(event.track);
      this.remoteVideoComponent.play(this.remoteStream);
    });

    // Add remote video track
    this.peerConnection.addEventListener('onaddstream', async (event: any) => {
      console.log('Stream received from the other side', event);
      this.remoteStream = event.stream;
      this.remoteVideoComponent.play(this.remoteStream);
    });

    // Listen for local ICE candidates on the local RTCPeerConnection
    this.peerConnection.addEventListener('icecandidate', event => {
      console.log('New candidate joined', event.candidate);
      if (event.candidate) {
        this.socket.emit('new-ice-candidate', this.receiverId, event.candidate);
      }
    });
  }

  setTestValues(): void {
    this.callerId = 'room1-devesh';
    this.receiverId = 'room1-devesh';
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.socket.disconnect();
    console.log('Socket disconnected');
  }

  startCall(): void {
    if (!this.socket.connected) {
      console.log('Cannot start a call because socket connection could not be established');
      return;
    }
    this.peerConnection.createOffer().then((offer) => {
      console.log('Offer created', offer);
      this.peerConnection.setLocalDescription(offer).then(() => {
        console.log('Local description set');
        this.socket.emit('offer', this.receiverId, offer);
        console.log('Offer emitted');
      }).catch((err) => {
        console.log(err);
      });;
    }).catch((err) => {
      console.log(err);
    });;
  }

  acceptCall(): void {
    if (!this.remoteOffer) {
      console.log('There is no video call request');
      return;
    }

    this.peerConnection.setRemoteDescription(new RTCSessionDescription(this.remoteOffer)).then(() => {
      console.log('Remote description set', this.remoteOffer);
      this.peerConnection.createAnswer().then((answer) => {
        this.peerConnection.setLocalDescription(answer).then(() => {
          console.log('Local description set', answer);
          this.socket.emit('call-accept', this.receiverId, answer);
          console.log('offer received', 'sent answer', 'Set local description', this.remoteOffer, answer);
          this.remoteOffer = null;
        }).catch((err) => {
          console.log(err)
        });
      }).catch((err) => {
        console.log(err);
      });

    }).catch((err) => {
      console.log(err);
    });;
  }

  send(value) {
    let data = {
      message: value
    };
    this.socket.emit('message', this.receiverId, data);
  }
  
}
