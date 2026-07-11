import { Injectable, Service } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';


export interface AlumnoPagoDTO {
  documento: string;
  nombreCompleto: string;
  profesorAsignado: string;
  fechaVencimiento: string | null;// Llega como String ISO (YYYY-MM-DD)
  diasParaVencer: number;
  activoPorPago: boolean;
}

// Definimos la interfaz de la página que nos devuelve Spring
export interface PaginaSpring<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

@Injectable({
  providedIn: 'root',
})
export class EstudianteService {
  private endpoint = `${environment.apiUrl}/estudiantes`;

  private estudianteBuscadoSource = new BehaviorSubject<any>(null);
  estudianteBuscado$ = this.estudianteBuscadoSource.asObservable();

  constructor(private http: HttpClient) {}
  registrarEstudiante(estudiante: any): Observable<any> {
    return this.http.post<any>(this.endpoint, estudiante);
  }
  obtenerEstudiantePorDocumento(documento: string): Observable<any> {
    return this.http.get<any>(`${this.endpoint}/documento/${documento}`);
  }

  obtenerAlumnosPaginados(page: number, size: number): Observable<PaginaSpring<AlumnoPagoDTO>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<PaginaSpring<AlumnoPagoDTO>>(`${this.endpoint}/paginacion`, { params: params });
  }

  actualizarEstudiante(id: number, estudiante: any): Observable<any> {
    return this.http.put(`${this.endpoint}/${id}`, estudiante);
  }

}
