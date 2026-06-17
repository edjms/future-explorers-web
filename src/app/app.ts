import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './components/shared/navbar/navbar';
import { Estudiantes } from './components/features/estudiantes/estudiantes';

@Component({
  selector: 'app-root',
  imports: [Navbar,
  Estudiantes],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('future-explorers-web');
}
