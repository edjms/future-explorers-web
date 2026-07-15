import { Component, signal } from '@angular/core';
import { Estudiantes } from '../../features/estudiantes/estudiantes';
import { Finanzas } from '../../features/finanzas/finanzas';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, Estudiantes, Finanzas],
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
