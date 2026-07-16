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

  listarTodosLosGastos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.endpoint}/gastos`);
  }

  listarGastosRecientes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.endpoint}/gastos/recientes`);
  }

  // POST: Registrar un gasto
  registrarGasto(gasto: any): Observable<any> {
    return this.http.post<any>(`${this.endpoint}/gastos`, gasto);
  }

  // PUT: Anular un gasto
  anularGasto(id: string): Observable<any> {
    return this.http.put<any>(`${this.endpoint}/gastos/${id}/anular`, {});
  }

  // GET: Obtener categorías para el selector
  obtenerCategorias(): Observable<any[]> {
    return this.http.get<any[]>(`${this.endpoint}/categorias-gasto`);
  }
}
