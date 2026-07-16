import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FinanzasService } from './services/finanzas';
import { GestionGastos } from './gestion-gastos/gestion-gastos';


@Component({
  selector: 'app-finanzas',
  imports: [CommonModule, FormsModule, GestionGastos],
  templateUrl: './finanzas.html',
  styleUrl: './finanzas.css',
})
export class Finanzas implements OnInit {
  private readonly finanzasService = inject(FinanzasService);
  protected readonly vistaActual = signal<'dashboard' | 'gestion'>('dashboard');

  // Variables para los inputs de tipo fecha
  fechaInicio: string = '';
  fechaFin: string = '';

  // Signals para manejar el estado del reporte
  protected readonly mostrarReporte = signal<boolean>(false);
  protected readonly reporteData = signal<any>(null);

  protected readonly listaGastos = signal<any[]>([]);

  ngOnInit() {
    // Al cargar el componente, podemos pre-cargar la lista de gastos
    this.cargarListaGastos();
  }

  // 🔍 Método real para generar el balance desde la API
  generarBalance() {
    if (!this.fechaInicio || !this.fechaFin) {
      alert('Por favor selecciona ambas fechas.');
      return;
    }

    this.finanzasService.obtenerBalancePorRango(this.fechaInicio, this.fechaFin).subscribe({
      next: (resultadoReporte: any) => {
        console.log('Datos del balance recibidos del backend:', resultadoReporte);

        // 🎯 Guardamos directamente el JSON que nos dio el backend en el signal
        this.reporteData.set(resultadoReporte);

        // 🔓 Mostramos la sección de resultados en el HTML
        this.mostrarReporte.set(true);
      },
      error: (err: any) => {
        console.error('Error al obtener el balance financiero:', err);
        alert('Hubo un error al consultar el balance con el servidor.');
      },
    });
  }

  anularGasto(id: string) {
    if (confirm('¿Estás seguro de que deseas anular este gasto?')) {
      this.finanzasService.anularGasto(id).subscribe({
        next: () => {
          alert('Gasto anulado correctamente.');
          this.cargarListaGastos(); // Recargamos la lista actualizada
        },
        error: (err: any) => {
          console.error('Error al anular el gasto:', err);
          alert('No se pudo anular el gasto.');
        },
      });
    }
  }

  // ⚙️ Cambiar de pantalla a Gastos
  irAGestionarGastos() {
    this.vistaActual.set('gestion');
  }

  cargarListaGastos() {
    // 🟢 CORREGIDO: Llamamos a 'listarTodosLosGastos()' que es el método real en tu servicio
    this.finanzasService.listarTodosLosGastos().subscribe({
      next: (gastos: any[]) => {
        this.listaGastos.set(Array.isArray(gastos) ? gastos : []);
      },
      error: (err: any) => {
        console.error('Error al listar los gastos:', err);
        this.listaGastos.set([]);
      },
    });
  }

  volverAlDashboard() {
    this.vistaActual.set('dashboard');
  }
}
