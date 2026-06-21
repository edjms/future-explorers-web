import { Injectable, Service } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root', // 👈 Esto es lo que le dice a Angular que es un servicio global
})
export class EstudianteService {
  // 🛠️ Desacoplado: Trae la URL base del entorno y le pega la ruta de estudiantes
  private endpoint = `${environment.apiUrl}/estudiantes`;

  // Inyectamos el HttpClient para poder hacer los disparos al Backend
  constructor(private http: HttpClient) {}

  /**
   * Envía el estudiante capturado en el formulario hacia Spring Boot
   */
  registrarEstudiante(estudiante: any): Observable<any> {
    return this.http.post<any>(this.endpoint, estudiante);
  }
}
