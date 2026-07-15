import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FinanzasService } from './services/finanzas';


@Component({
  selector: 'app-finanzas',
  imports: [CommonModule, FormsModule],
  templateUrl: './finanzas.html',
  styleUrl: './finanzas.css',
})
export class Finanzas {
  private readonly finanzasService = inject(FinanzasService);

  // Variables para los inputs de tipo fecha
  fechaInicio: string = '';
  fechaFin: string = '';

  // Signals para manejar el estado del reporte
  protected readonly mostrarReporte = signal<boolean>(false);
  protected readonly reporteData = signal<any>(null);

  // 🔍 Método real para generar el balance desde la API
  generarBalance() {
    if (!this.fechaInicio || !this.fechaFin) {
      alert('Por favor selecciona ambas fechas.');
      return;
    }

    this.finanzasService.obtenerBalancePorRango(this.fechaInicio, this.fechaFin).subscribe({
      next: (resultadoReporte) => {
        console.log('Datos del balance recibidos del backend:', resultadoReporte);

        // 🎯 Guardamos directamente el JSON que nos dio el backend en el signal
        this.reporteData.set(resultadoReporte);

        // 🔓 Mostramos la sección de resultados en el HTML
        this.mostrarReporte.set(true);
      },
      error: (err) => {
        console.error('Error al obtener el balance financiero:', err);
        alert('Hubo un error al consultar el balance con el servidor.');
      }
    });
  }

  // ⚙️ Cambiar de pantalla a Gastos (Próximo paso)
  irAGestionarGastos() {
    alert('¡Caminando hacia la gestión de gastos!');
  }
}
