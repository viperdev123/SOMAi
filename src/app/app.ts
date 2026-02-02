import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DashBoard } from '../dashBoard/dash-board/dash-board';
import { SideBar } from '../sideBar/side-bar/side-bar';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    DashBoard,
    SideBar
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App {
  protected readonly title = signal('agenticAI');
}
