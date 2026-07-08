import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EstudianteService, AlumnoPagoDTO } from '../../servicios/estudiante';
import { ModalPago } from '../modal-pago/modal-pago';

@Component({
  selector: 'app-tabla-estudiantes',
  imports: [CommonModule, ModalPago],
  templateUrl: './tabla-estudiantes.html',
  styles: `
    .tabla-container {
      background: #ffffff;
      border-radius: 12px;
      box-shadow:
        0 4px 6px -1px rgba(0, 0, 0, 0.05),
        0 2px 4px -1px rgba(0, 0, 0, 0.03);
      border: 1px solid #e2e8f0;
      overflow: hidden; /* Para que los bordes redondeados corten la tabla */
      width: 100%;
    }

    .tabla-estudiantes {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 0.95rem;
    }

    .tabla-estudiantes th {
      background-color: #f8fafc;
      color: #475569;
      font-weight: 600;
      padding: 1rem 1.5rem;
      border-bottom: 2px solid #e2e8f0;
    }

    .tabla-estudiantes td {
      padding: 1rem 1.5rem;
      border-bottom: 1px solid #f1f5f9;
      color: #334155;
    }

    /* Efecto Hover en las filas */
    .tabla-estudiantes tbody tr:hover {
      background-color: #f8fafc;
    }

    /* Alineaciones útiles */
    .text-center {
      text-align: center !important;
    }

    /* Óvalos de Estado (Badges) */
    .badge {
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.8rem;
      font-weight: 600;
    }
    .badge-activo {
      background-color: #dcfce7;
      color: #15803d;
    }
    .badge-inactivo {
      background-color: #fee2e2;
      color: #b91c1c;
    }

    /* Botones de Acción (Iconos) */
    .btn-accion {
      background: none;
      border: none;
      font-size: 1.1rem;
      cursor: pointer;
      padding: 0.25rem 0.5rem;
      border-radius: 6px;
      transition: background-color 0.2s;
      margin: 0 0.25rem;
    }
    .btn-editar:hover {
      background-color: #e0f2fe;
    }
    .btn-eliminar:hover {
      background-color: #fee2e2;
    }

    /* Estilos extra para la botonera de paginación */
    .paginacion-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 1.5rem;
      font-size: 0.9rem;
      color: #64748b;
      padding: 0 0.5rem;
    }

    .btn-paginacion {
      background-color: #ffffff;
      border: 1px solid #cbd5e1;
      color: #334155;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-paginacion:hover:not(:disabled) {
      background-color: #f1f5f9;
      border-color: #94a3b8;
    }

    .btn-paginacion:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-group {
      display: flex;
      gap: 0.5rem;
    }
  `,
})
export class TablaEstudiantes implements OnInit {
  alumnos: AlumnoPagoDTO[] = [];
  alumnosFiltrados: AlumnoPagoDTO[] = [];
  // Variables para controlar la paginación
  paginaActual: number = 0;
  tamanoPagina: number = 6;
  totalElementos: number = 0;
  totalPaginas: number = 0;

  Math = Math;

  mostrarModal: boolean = false;
  alumnoParaPagar: any = null;

  constructor(
    private alumnoService: EstudianteService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.cargarAlumnos();
  }

  cargarAlumnos(): void {
    this.alumnoService.obtenerAlumnosPaginados(this.paginaActual, this.tamanoPagina).subscribe({
      next: (response: any) => {
        this.alumnos = response.content;
        this.alumnosFiltrados = response.content;
        this.totalElementos = response.totalElements;
        this.totalPaginas = response.totalPages;

        console.log('Alumnos asignados correctamente:', this.alumnos);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar alumnos paginados', err);
      },
    });
  }

  public filtrar(cedula: string): void {
    const busqueda = cedula.trim();
    console.log('2. Tabla recibió la cédula:', busqueda);
    console.log('3. Alumnos disponibles en la página:', this.alumnos);

    if (!busqueda) {
      this.alumnosFiltrados = this.alumnos; // Si limpia el buscador, regresan todos los de la página
      return;
    }

    // Filtra sobre los alumnos de la página actual por su documento
    this.alumnosFiltrados = this.alumnos.filter(
      (alumno) => {
        console.log('Revisando alumno documento:', alumno.documento);
        return alumno.documento && alumno.documento.toString().includes(busqueda)
      });
    console.log('4. Alumnos que pasaron el filtro:', this.alumnosFiltrados);
    this.cdr.detectChanges();
  }


  paginaSiguiente(): void {
    console.log('--- Intentando ir a página siguiente ---');
    console.log('Página actual antes:', this.paginaActual);
    console.log('Total páginas en el componente:', this.totalPaginas);

    if (this.paginaActual < this.totalPaginas - 1) {
      this.paginaActual++;
      console.log('Página cambió a:', this.paginaActual);
      this.cargarAlumnos();
    } else {
      console.warn(
        'No se cumplió la condición para avanzar:',
        `${this.paginaActual} < ${this.totalPaginas - 1}`,
      );
    }
  }

  paginaAnterior(): void {
    if (this.paginaActual > 0) {
      this.paginaActual--;
      this.cargarAlumnos();
    }
  }
  abrirModalPago(alumno: any): void {
    this.alumnoParaPagar = alumno;
    this.mostrarModal = true;
  }

  cerrarModalPago(): void {
    this.mostrarModal = false;
    this.alumnoParaPagar = null;
  }

  recargarTablaPorPago(): void {
    this.cargarAlumnos(); // O el método que uses para refrescar los datos de la tabla
  }
}
