import { Component, signal } from '@angular/core';
import { Estudiantes } from '../../features/estudiantes/estudiantes';
import { Finanzas } from '../../features/finanzas/finanzas';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule,RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  protected readonly moduloActivo = signal<string>('estudiantes');

  // Función para cambiar de pantalla cuando den clic arriba
  cambiarModulo(modulo: string) {
    this.moduloActivo.set(modulo);
  }
}
