import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FinanzasService {
  private readonly http = inject(HttpClient);

  private endpoint = `${environment.apiUrl}`;

  obtenerBalancePorRango(fechaInicio: string, fechaFin: string): Observable<any> {
    const params = new HttpParams()
      .set('inicio', fechaInicio) // Asegúrate de que coincida con el nombre del parámetro en tu @RequestParam de Spring Boot
      .set('fin', fechaFin);

    return this.http.get<any>(`${this.endpoint}/contabilidad/balance`, { params });
  }

  listarGastos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.endpoint}/gastos`);
  }

  registrarGasto(gasto: any): Observable<any> {
    return this.http.post<any>(`${this.endpoint}/gastos`, gasto);
  }

  anularGasto(id: number): Observable<any> {
    return this.http.put<any>(`${this.endpoint}/gastos/${id}/anular`, {});
  }
}
