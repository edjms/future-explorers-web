import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PagoService {
  // 🎯 Dejemos el nombre estándar 'PagoService'
  private endpoint = `${environment.apiUrl}/pagos`;

  // 🎯 Usamos inject() en lugar del constructor para evitar el error NG2028
  private http = inject(HttpClient);

  registrarPago(pago: any): Observable<any> {
    return this.http.post<any>(this.endpoint, pago);
  }
}
