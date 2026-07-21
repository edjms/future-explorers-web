import { Component, inject,ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../servicios/auth';
import { LoginRequest } from '../../../../models/login-response.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private authService = inject(Auth);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  credentials: LoginRequest = {
    email: '',
    password: '',
  };

  cargando: boolean = false;
  mensajeError: string | null = null;

  onLogin(): void {
    this.mensajeError = null;
    this.cargando = true;

    this.authService.login(this.credentials).subscribe({
      next: (res) => {
        this.cargando = false;
        this.cdr.detectChanges(); // Refresca UI
        this.router.navigate(['/inicio']);
      },
      error: (err) => {
        // 1. Liberamos el botón inmediatamente
        this.cargando = false;

        // 2. Extraemos y limpiamos el mensaje del backend
        if (typeof err.error === 'string') {
          this.mensajeError = err.error.replace(/^Error:\s*/i, '');
        } else if (err.error?.message) {
          this.mensajeError = err.error.message;
        } else {
          this.mensajeError = 'Credenciales incorrectas. Verifica tu email o contraseña.';
        }

        // 3. Forzamos a Angular a pintar el mensaje y reactivar el botón de inmediato
        this.cdr.detectChanges();
      },
    });
  }
}
