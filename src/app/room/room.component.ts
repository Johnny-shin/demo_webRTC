import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {

  rooms: any = [];

  constructor() { 
    this.rooms = [
      { id: 'e3c38f46-3680-45a9-a559-ccbe21fb1cde', name: 'Room 1'},
      { id: '6f519503-1521-4391-bdb5-e56601c3d165', name: 'Room 2'},
      { id: '7521ca2d-bde7-4110-9091-04536cb4c85a', name: 'Volunteer'},
      { id: 'ccea7333-289d-4b07-9fa6-00284cdaa985', name: 'Vulnerable person'},
    ]
  }

  ngOnInit(): void {
  }

}
