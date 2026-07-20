import { Component, Input, Output, EventEmitter, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EstudianteService } from '../../servicios/estudiante';
import { ProfesorService } from '../../../profesores/servicios/profesor';

@Component({
  selector: 'app-modal-editar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modal-editar.html',
  styleUrl: './modal-editar.css',
})
export class ModalEditar implements OnInit {
  // --- Inputs y Outputs ---
  @Input() estudiante: any = null;
  @Output() cerrar = new EventEmitter<void>();
  @Output() edicionExitosa = new EventEmitter<void>();

  // --- Propiedades del Componente ---
  form!: FormGroup;
  listaProfesores: any[] = [];
  imagenPreview: string | null = null; // 🎯 Para controlar la vista previa en base64 de la foto

  // --- Inyección de Servicios (Angular Moderno) ---
  private fb = inject(FormBuilder);
  private estudianteService = inject(EstudianteService);
  private profesorService = inject(ProfesorService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    // 1. Inicializamos el formulario vacío para evitar errores de renderizado en el HTML
    this.inicializarFormularioVacio();

    // 2. Traemos la lista de profesores para llenar el select dinámico
    this.cargarProfesores();

    // 3. Consultamos al backend usando el documento recibido de la tabla
    if (this.estudiante && this.estudiante.documento) {
      this.cargarDetalleEstudiante(this.estudiante.documento.toString());
    } else {
      console.error('No se pudo abrir el modal porque no se recibió el documento del estudiante.');
    }
  }

  // --- Métodos de Inicialización y Carga ---

  inicializarFormularioVacio(): void {
    this.form = this.fb.group({
      documento: ['', Validators.required],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      fechaNacimiento: [''],
      imagenUrl: ['no se tiene aun'],
      profesorId: ['', Validators.required],
      activo: [true],
    });
  }

  cargarDetalleEstudiante(documento: string): void {
    this.estudianteService.obtenerEstudiantePorDocumento(documento).subscribe({
      next: (estudianteCompleto: any) => {
        console.log('¡Datos completos traídos por Documento!', estudianteCompleto);

        // Guardamos el ID real de la base de datos en el objeto para el método PUT
        this.estudiante.id = estudianteCompleto.id;

        // Rellenamos el formulario reactivo
        this.form.patchValue({
          documento: estudianteCompleto.documento,
          nombre: estudianteCompleto.nombre,
          apellido: estudianteCompleto.apellido,
          email: estudianteCompleto.email || estudianteCompleto.correo,
          fechaNacimiento: estudianteCompleto.fechaNacimiento,
          imagenUrl: estudianteCompleto.imagenUrl,
          profesorId: estudianteCompleto.profesor?.id || '',
          activo: estudianteCompleto.activo ?? true,
        });

        // Forzamos la actualización visual por si llegó diferido
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error al consultar el estudiante por documento:', err);
        alert('No se pudieron precargar los datos del estudiante.');
      },
    });
  }

  cargarProfesores(): void {
    this.profesorService.obtenerProfesores().subscribe({
      next: (data: any) => {
        this.listaProfesores = data.content || data;
        this.cdr.detectChanges(); // Asegura que el desplegable se entere del cambio
      },
      error: (err: any) => {
        console.error('Error al cargar profesores desde el backend', err);
      },
    });
  }

  // --- Manejo de Archivos e Imágenes ---

  capturarNombreArchivo(event: any): void {
    const archivo = event.target.files[0];
    if (archivo) {
      // Guardamos el nombre del archivo en el control del formulario
      this.form.patchValue({
        imagenUrl: archivo.name,
      });

      // 🎯 Corregido: Leemos el archivo real usando FileReader y lo asignamos a imagenPreview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagenPreview = reader.result as string;
        this.cdr.detectChanges(); // Forzamos el redibujado de la foto en el avatar redondo
      };
      reader.readAsDataURL(archivo);
    }
  }

  // --- Acciones del Formulario ---

  guardarCambios(): void {
    if (this.form.invalid) {
      alert('Por favor, llene todos los campos requeridos correctamente.');
      return;
    }

    const idEstudiante = this.estudiante.id;
    const valoresFormulario = this.form.value;

    // 🏗️ Mapeo del JSON exacto que tu backend de Spring Boot espera recibir
    const estudianteAEnviar = {
      documento: valoresFormulario.documento,
      nombre: valoresFormulario.nombre,
      apellido: valoresFormulario.apellido,
      email: valoresFormulario.email,
      fechaNacimiento: valoresFormulario.fechaNacimiento,
      imagenUrl: valoresFormulario.imagenUrl,
      activo: valoresFormulario.activo,
      profesor: {
        id: Number(valoresFormulario.profesorId),
      },
    };

    this.estudianteService.actualizarEstudiante(idEstudiante, estudianteAEnviar).subscribe({
      next: (response) => {
        console.log('¡Actualizado con éxito!', response);
        this.cerrar.emit();
        this.edicionExitosa.emit(); // Notifica a la tabla que recargue los datos

        // Cierra el modal
      },
      error: (err: any) => {
        console.error('Error al actualizar', err);
        alert('Error al actualizar el estudiante');
      },
    });
  }

  cancelar(): void {
    this.cerrar.emit();
    this.cdr.detectChanges();
  }
}
