import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoomDetailComponent } from './room/room-detail/room-detail.component';
import { RoomComponent } from './room/room.component';

const routes: Routes = [
  { path: '', redirectTo: '/rooms', pathMatch: 'full'},
  { path: 'rooms', component: RoomComponent },
  { path: 'rooms/:id', component: RoomDetailComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
