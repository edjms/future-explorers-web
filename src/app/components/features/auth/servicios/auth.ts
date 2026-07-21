import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { LoginRequest, LoginResponse } from '../../../../models/login-response.model';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root',
})
export class Auth {
  private http = inject(HttpClient);
  private endpoint = `${environment.apiUrl}/auth`;
  private router = inject(Router);

  private TOKEN_KEY = 'jwt_token';

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.endpoint}/login`, credentials).pipe(
      tap((response: LoginResponse) => {
        if (response && response.token) {
          localStorage.setItem(this.TOKEN_KEY, response.token);
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
    localStorage.removeItem(this.TOKEN_KEY);
    this.router.navigate(['/login']);
  }
}
