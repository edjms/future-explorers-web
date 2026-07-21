import { Component, signal, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Auth } from '../../features/auth/servicios/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  // Inyección de servicios
  private authService = inject(Auth);

  // Estados del componente con Signals
  protected readonly moduloActivo = signal<string>('estudiantes');
  protected readonly isDropdownOpen = signal<boolean>(false);

  // Información del usuario
  public readonly userEmail: string = 'futureexplorers1@gmail.com';

  // Cambiar pestaña activa
  cambiarModulo(modulo: string): void {
    this.moduloActivo.set(modulo);
  }

  // Alternar el menú desplegable
  toggleDropdown(): void {
    this.isDropdownOpen.update((prev) => !prev);
  }

  // Cerrar sesión
  onLogout(): void {
    this.isDropdownOpen.set(false);
    this.authService.logout();
  }

  // Cierra el menú flotante si el usuario hace clic fuera de la zona del usuario
  @HostListener('document:click', ['$event'])
  closeDropdownOutside(event: Event): void {
    const target = event.target as HTMLElement;

    // Verifica ambas clases por si usaste .navbar-user-wrapper o .navbar-user-container en tu HTML
    if (!target.closest('.navbar-user-wrapper') && !target.closest('.navbar-user-container')) {
      this.isDropdownOpen.set(false);
    }
  }
}
