import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import {ProfesorModel} from '../../../../models/profesor.model';

@Injectable({
  providedIn: 'root',
})
export class ProfesorService {
  private http = inject(HttpClient);

  private endpoint = `${environment.apiUrl}/profesores`;

  constructor() {}

  obtenerProfesores(): Observable<ProfesorModel[]> {
    return this.http.get<ProfesorModel[]>(this.endpoint);
  }

  crearProfesor(profesor: ProfesorModel): Observable<ProfesorModel> {
    return this.http.post<ProfesorModel>(this.endpoint, profesor);
  }

  actualizarProfesor(id: number, profesor: ProfesorModel): Observable<ProfesorModel> {
    return this.http.put<ProfesorModel>(`${this.endpoint}/${id}`, profesor);
  }
}
