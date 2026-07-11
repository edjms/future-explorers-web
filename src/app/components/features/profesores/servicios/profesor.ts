import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProfesorService {
  private http = inject(HttpClient);

  private endpoint = `${environment.apiUrl}/profesores`;

  constructor() {}

  obtenerProfesores(): Observable<any> {
    return this.http.get<any>(this.endpoint);
  }
}
