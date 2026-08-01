import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { TarifaModel } from '../../../../models/tarifa.model';

@Injectable({
  providedIn: 'root',
})
export class Tarifa {
  private endpoint = `${environment.apiUrl}/tarifas`;

  private http = inject(HttpClient);

  constructor() {}

  obtenerTarifa(): Observable<TarifaModel[]> {
    return this.http.get<TarifaModel[]>(this.endpoint);
  }
}
