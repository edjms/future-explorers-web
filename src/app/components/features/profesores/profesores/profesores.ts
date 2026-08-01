import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfesorService } from '../servicios/profesor';
import { ProfesorModel } from '../../../../models/profesor.model';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-profesores',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profesores.html',
  styleUrl: './profesores.css'
})
export class Profesores implements OnInit {
  profesores: ProfesorModel[] = [];
  cargando: boolean = true;
  mensajeError: string | null = null;
  mensajeExito: string | null = null;

  mostrarModal: boolean = false;
  editando: boolean = false;

  profesorForm: ProfesorModel = this.inicializarProfesor();
  imagenPreview: string | null = null; // 👈 Para la vista previa de la imagen seleccionada
  urlPicture = environment.urlPictures;
  constructor(
    private profesorService: ProfesorService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarProfesores();
  }

  inicializarProfesor(): ProfesorModel {
    return {
      identificacion: '',
      nombre: '',
      apellido: '',
      email: '',
      telefono: '',
      imagenUrl: '',
      porcentajeComision: 0.40
    };
  }

  cargarProfesores(): void {
    this.cargando = true;
    this.profesorService.obtenerProfesores().subscribe({
      next: (data: ProfesorModel[]) => {
        this.profesores = data;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err: unknown) => {
        console.error('Error al obtener profesores:', err);
        this.mensajeError = 'No se pudieron cargar los profesores.';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  abrirModalCrear(): void {
    this.editando = false;
    this.profesorForm = this.inicializarProfesor();
    this.imagenPreview = null;
    this.limpiarMensajes();
    this.mostrarModal = true;
  }

  abrirModalEditar(profesor: ProfesorModel): void {
    this.editando = true;
    this.profesorForm = { ...profesor,
      telefono: profesor.telefono ?? '' };
    this.imagenPreview = null; // Si viene una URL o nombre relativo, la renderiza la plantilla
    this.limpiarMensajes();
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.imagenPreview = null;
  }

  // Captura el nombre o archivo subido desde el input file
  capturarArchivo(event: any): void {
    const archivo = event.target.files[0];
    if (archivo) {
      this.profesorForm.imagenUrl = archivo.name; // O ajusta si subes la imagen a un servidor
      const reader = new FileReader();
      reader.onload = () => {
        this.imagenPreview = reader.result as string;
      };
      reader.readAsDataURL(archivo);
    }
  }

  guardarProfesor(): void {
    this.limpiarMensajes();
    console.log('1. Payload a enviar:', JSON.stringify(this.profesorForm, null, 2));
    if (this.editando && this.profesorForm.id) {
      this.profesorService.actualizarProfesor(this.profesorForm.id, this.profesorForm).subscribe({
        next: () => {
          this.mensajeExito = 'Profesor actualizado correctamente';
          this.cerrarModal();
          this.cargarProfesores();
        },
        error: (err: any) => {
          this.mensajeError = typeof err.error === 'string' ? err.error : 'Error al actualizar el profesor';
          this.cdr.detectChanges();
        }
      });
    } else {
      this.profesorService.crearProfesor(this.profesorForm).subscribe({
        next: () => {
          this.mensajeExito = 'Profesor creado con éxito';
          this.cerrarModal();
          this.cargarProfesores();
        },
        error: (err: any) => {
          this.mensajeError = typeof err.error === 'string' ? err.error : 'Error al registrar el profesor';
          this.cdr.detectChanges();
        }
      });
    }
  }

  limpiarMensajes(): void {
    this.mensajeError = null;
    this.mensajeExito = null;
  }
}
