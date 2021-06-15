import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-video-chat-room',
  templateUrl: './video-chat-room.component.html',
  styleUrls: ['./video-chat-room.component.css']
})
export class VideoChatRoomComponent implements OnInit {

  @ViewChild('videoPlayer') videoPlayer: ElementRef;

  constructor() { }

  ngOnInit(): void {
  }

  play(stream: MediaStream): void {
    this.videoPlayer.nativeElement.srcObject = stream;
  }

}
