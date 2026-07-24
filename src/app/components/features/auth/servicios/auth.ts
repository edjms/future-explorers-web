import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { LoginRequest, LoginResponse } from '../../../../models/login-response.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private http = inject(HttpClient);
  private router = inject(Router);
  private endpoint = `${environment.apiUrl}/auth`;

  private TOKEN_KEY = 'jwt_token';
  private USER_KEY = 'user_data';

  // Signal que mantendrá los datos del usuario en memoria
  public currentUser = signal<LoginResponse | null>(this.getUserFromStorage());

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.endpoint}/login`, credentials).pipe(
      tap((response: LoginResponse) => {
        if (response && response.token) {
          // 1. Guarda el token en localStorage
          localStorage.setItem(this.TOKEN_KEY, response.token);

          // 2. Guarda el objeto completo del usuario en localStorage
          localStorage.setItem(this.USER_KEY, JSON.stringify(response));

          // 3. Actualiza el Signal para que la aplicación reaccione de inmediato
          this.currentUser.set(response);
        }
      }),
    );
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    // Limpia las claves de localStorage y el Signal
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUser.set(null);

    this.router.navigate(['/login']);
  }

  // Carga los datos guardados en el navegador al recargar o abrir la página
  private getUserFromStorage(): LoginResponse | null {
    const userJson = localStorage.getItem(this.USER_KEY);
    if (!userJson) return null;
    try {
      return JSON.parse(userJson) as LoginResponse;
    } catch {
      return null;
    }
  }
}
