import { Component, OnInit, inject, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FinanzasService } from '../services/finanzas';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-gestion-gastos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-gastos.html',
  styleUrl: './gestion-gastos.css',
})
export class GestionGastos implements OnInit {
  private readonly finanzasService = inject(FinanzasService);

  volver = output<void>();

  // Signals para almacenar datos y estados UI
  protected readonly listaGastos = signal<any[]>([]);
  protected readonly categorias = signal<any[]>([]);
  protected readonly cargando = signal<boolean>(false);
  protected readonly guardando = signal<boolean>(false);
  protected readonly mostrandoTodos = signal<boolean>(false);

  // Signals para avisos elegantes en pantalla (sin alerts nativos)
  protected readonly mensajeError = signal<string | null>(null);
  protected readonly mensajeExito = signal<string | null>(null);

  // Formulario de nuevo gasto (Modelo de datos)
  nuevoGasto = {
    concepto: '',
    valor: null as number | null,
    metodoPago: 'Efectivo',
    fechaGasto: new Date().toISOString().split('T')[0], // Fecha de hoy por defecto
    categoria: {
      id: '',
    },
    observacion: '',
  };

  ngOnInit() {
    this.cargarCategorias();
    this.consultarGastosPorDefecto();
  }

  // Carga inicial de categorías de la BD
  cargarCategorias() {
    this.finanzasService.obtenerCategorias().subscribe({
      next: (cats: any[]) => {
        this.categorias.set(Array.isArray(cats) ? cats : []);
      },
      error: (err: any) => {
        console.error('Error al cargar categorías:', err);
        this.categorias.set([]);
      },
    });
  }

  // Consulta por defecto para llenar la tabla
  consultarGastosPorDefecto() {
    this.cargando.set(true);
    this.mostrandoTodos.set(false);

    this.finanzasService.listarGastosRecientes().subscribe({
      next: (gastos: any[]) => {
        this.listaGastos.set(Array.isArray(gastos) ? gastos : []);
        this.cargando.set(false);
      },
      error: (err: any) => {
        console.error('Error al cargar gastos recientes:', err);
        this.listaGastos.set([]);
        this.cargando.set(false);
      },
    });
  }

  // Carga el historial completo de gastos
  cargarTodoElHistorial() {
    this.cargando.set(true);
    this.mensajeError.set(null);

    this.finanzasService.listarTodosLosGastos().subscribe({
      next: (todosLosGastos: any[]) => {
        this.listaGastos.set(Array.isArray(todosLosGastos) ? todosLosGastos : []);
        this.mostrandoTodos.set(true);
        this.cargando.set(false);
      },
      error: (err: any) => {
        console.error('Error al cargar todo el historial:', err);
        this.mensajeError.set('No se pudo cargar el historial completo de gastos.');
        this.cargando.set(false);
      },
    });
  }

  // POST: Enviar el nuevo gasto a Spring Boot
  guardarGasto() {
    this.limpiarMensajes();

    if (!this.nuevoGasto.concepto || !this.nuevoGasto.valor || !this.nuevoGasto.categoria.id) {
      this.mensajeError.set('Por favor, completa los campos obligatorios (Concepto, Valor y Categoría).');
      return;
    }

    this.guardando.set(true);

    this.finanzasService.registrarGasto(this.nuevoGasto)
      .pipe(
        finalize(() => {
          // 🎯 Ocurra lo que ocurra, liberamos el botón inmediatamente
          this.guardando.set(false);
        })
      )
      .subscribe({
        next: (gastoCreado: any) => {
          this.mensajeExito.set('¡Gasto registrado exitosamente!');
          this.consultarGastosPorDefecto(); // Recargar la tabla
          this.limpiarFormulario();

          // El mensaje de éxito se oculta solo a los 4 segundos
          setTimeout(() => this.mensajeExito.set(null), 4000);
        },
        error: (err: any) => {
          console.error('Error al guardar el gasto:', err);
          this.mensajeError.set(
            err.error?.mensaje || 'No se pudo registrar el gasto en el servidor. Intenta de nuevo.'
          );
        },
      });
  }

  // PUT: Anular un gasto usando su ID
  anularGasto(id: string) {
    this.limpiarMensajes();

    this.finanzasService.anularGasto(id).subscribe({
      next: () => {
        this.mensajeExito.set(`El gasto ${id} ha sido anulado con éxito.`);
        this.consultarGastosPorDefecto(); // Recargar la tabla
        setTimeout(() => this.mensajeExito.set(null), 4000);
      },
      error: (err: any) => {
        console.error('Error al anular el gasto:', err);
        this.mensajeError.set('Ocurrió un error al intentar anular el gasto.');
      },
    });
  }

  limpiarFormulario() {
    this.nuevoGasto = {
      concepto: '',
      valor: null,
      metodoPago: 'Efectivo',
      fechaGasto: new Date().toISOString().split('T')[0],
      categoria: { id: '' },
      observacion: '',
    };
  }

  limpiarMensajes() {
    this.mensajeError.set(null);
    this.mensajeExito.set(null);
  }

  onVolver() {
    this.volver.emit();
  }
}
