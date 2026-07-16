import { Component, OnInit, inject, signal, output} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FinanzasService } from '../services/finanzas';

@Component({
  selector: 'app-gestion-gastos',
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-gastos.html',
  styleUrl: './gestion-gastos.css',
})
export class GestionGastos implements OnInit {
  private readonly finanzasService = inject(FinanzasService);

  volver = output<void>();

  // Signals para almacenar datos
  protected readonly listaGastos = signal<any[]>([]);
  protected readonly categorias = signal<any[]>([]);
  protected readonly cargando = signal<boolean>(false);

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
  protected readonly mostrandoTodos = signal<boolean>(false);

// 2. Modifica el método de carga por defecto para que llame a tu nuevo endpoint de Spring Boot
  consultarGastosPorDefecto() {
    this.cargando.set(true);
    this.mostrandoTodos.set(false); // Restablecemos el estado a "solo recientes"

    // Llamamos al nuevo endpoint de los 8 recientes
    this.finanzasService.listarGastosRecientes().subscribe({ // <-- Si creaste un método específico en el servicio para '/recientes', úsalo aquí. Si no, usa el general por ahora.
      next: (gastos: any[]) => {
        this.listaGastos.set(Array.isArray(gastos) ? gastos : []);
        this.cargando.set(false);
      },
      error: (err: any) => {
        console.error('Error al cargar gastos recientes:', err);
        this.listaGastos.set([]);
        this.cargando.set(false);
      }
    });
  }

// 3. Agrega este nuevo método para traer la totalidad de los gastos de la base de datos
  cargarTodoElHistorial() {
    this.cargando.set(true);

    // Aquí llamamos al endpoint que trae absolutamente todo (sin el límite de 8)
    this.finanzasService.listarTodosLosGastos().subscribe({
      next: (todosLosGastos: any[]) => {
        this.listaGastos.set(Array.isArray(todosLosGastos) ? todosLosGastos : []);
        this.mostrandoTodos.set(true); // Cambiamos el estado a "mostrando todos"
        this.cargando.set(false);
      },
      error: (err: any) => {
        console.error('Error al cargar todo el historial:', err);
        alert('No se pudo cargar el historial completo.');
        this.cargando.set(false);
      }
    });
  }
  // POST: Enviar el nuevo gasto a Spring Boot
  guardarGasto() {
    if (!this.nuevoGasto.concepto || !this.nuevoGasto.valor || !this.nuevoGasto.categoria.id) {
      alert('Por favor, completa los campos obligatorios (Concepto, Valor y Categoría).');
      return;
    }

    this.finanzasService.registrarGasto(this.nuevoGasto).subscribe({
      next: (gastoCreado: any) => {
        alert('¡Gasto registrado exitosamente!');
        this.consultarGastosPorDefecto(); // Recargar la tabla
        this.limpiarFormulario();
      },
      error: (err: any) => {
        console.error('Error al guardar el gasto:', err);
        alert('No se pudo registrar el gasto en el servidor.');
      },
    });
  }

  // PUT: Anular un gasto usando su ID de tipo String
  anularGasto(id: string) {
    if (confirm(`¿Estás seguro de que deseas anular el gasto ${id}?`)) {
      this.finanzasService.anularGasto(id).subscribe({
        next: () => {
          alert('El gasto ha sido anulado con éxito.');
          this.consultarGastosPorDefecto(); // Recargar la tabla
        },
        error: (err: any) => {
          console.error('Error al anular el gasto:', err);
          alert('Ocurrió un error al intentar anular el gasto.');
        },
      });
    }
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

  onVolver() {
    this.volver.emit();
  }
}
