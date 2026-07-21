import { Component, inject, signal } from '@angular/core';
import { Navbar } from './components/shared/navbar/navbar';
import { Router, RouterOutlet } from '@angular/router';
import { Auth } from './components/features/auth/servicios/auth';



@Component({
  selector: 'app-root',
  imports: [Navbar, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  //protected readonly title = signal('future-explorers-web');
  auth = inject(Auth);
  private router = inject(Router);

  esPaginaLogin(): boolean {
    return this.router.url.includes('/login');
  }
}
