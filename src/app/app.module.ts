import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { ScrollingModule } from '@angular/cdk/scrolling';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RoomComponent } from './room/room.component';
import { RoomDetailComponent } from './room/room-detail/room-detail.component';
import { ChatRoomComponent } from './room/room-detail/chat-room/chat-room.component';
import { VideoChatRoomComponent } from './room/room-detail/video-chat-room/video-chat-room.component';

@NgModule({
  declarations: [
    AppComponent,
    RoomComponent,
    RoomDetailComponent,
    ChatRoomComponent,
    VideoChatRoomComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatListModule,
    MatInputModule,
    MatButtonModule,
    MatGridListModule,
    ScrollingModule,
    MatIconModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
