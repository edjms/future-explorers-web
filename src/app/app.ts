import { Component, signal } from '@angular/core';
import { Navbar } from './components/shared/navbar/navbar';
import { RouterOutlet } from '@angular/router';



@Component({
  selector: 'app-root',
  imports: [Navbar,RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('future-explorers-web');

}
