import { Component, signal } from '@angular/core';
import { Navbar } from './components/shared/navbar/navbar';



@Component({
  selector: 'app-root',
  imports: [Navbar],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('future-explorers-web');

}
