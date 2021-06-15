import { EventEmitter, Output } from '@angular/core';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.css']
})
export class ChatRoomComponent implements OnInit {

  @ViewChild('messageBox') messageBox: ElementRef;
  @Output() message = new EventEmitter<any>();
  
  messages = []

  constructor() { }

  ngOnInit(): void {
  }

  push(message: string, isLocal: boolean) {
    this.messages.push({
      message: message,
      timestamp: new Date(),
      isLocal: isLocal
    })
  }

  send() {
    let message = this.messageBox.nativeElement.value?.trim();
    if(!message) return;
    this.message.emit(message);
    this.push(message, true);
    this.messageBox.nativeElement.value = '';
  }
}
