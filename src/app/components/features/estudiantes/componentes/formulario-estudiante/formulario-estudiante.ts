import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { EstudianteService } from '../../servicios/estudiante';
import { ProfesorService } from '../../../profesores/servicios/profesor';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-formulario-estudiante',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    NgFor,
    NgIf
  ],
  templateUrl: './formulario-estudiante.html',
  styles: `
    /* Fondo oscuro que cubre toda la pantalla */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(15, 23, 42, 0.6);
      backdrop-filter: blur(4px);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
      font-family: system-ui, -apple-system, sans-serif;
    }

    /* Contenedor del Modal: Más amplio (850px) */
    .modal-wrapper {
      background: #ffffff;
      width: 90%;
      max-width: 850px;
      border-radius: 16px;
      box-shadow:
        0 20px 25px -5px rgba(0, 0, 0, 0.1),
        0 10px 10px -5px rgba(0, 0, 0, 0.04);
      overflow: hidden;
      animation: fadeIn 0.3s ease-out;
    }

    .modal-header {
      background: #f8fafc;
      padding: 1.25rem 2rem;
      border-bottom: 1px solid #e2e8f0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .modal-header h2 {
      font-size: 1.3rem;
      color: #1e293b;
      margin: 0;
      font-weight: 600;
    }

    .btn-close-x {
      background: none;
      border: none;
      font-size: 1.2rem;
      cursor: pointer;
      color: #64748b;
    }

    /* Banner Elegante de Error */
    .error-banner {
      margin: 1rem 2rem 0 2rem;
      padding: 0.85rem 1.25rem;
      background-color: #fef2f2;
      border: 1px solid #fecaca;
      border-radius: 8px;
      color: #991b1b;
      font-size: 0.9rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      animation: fadeIn 0.2s ease-in-out;
    }

    .error-banner button {
      background: transparent;
      border: none;
      color: #991b1b;
      font-weight: bold;
      cursor: pointer;
    }

    /* Formulario Layout: 2 Columnas */
    .modal-body-form {
      padding: 1.5rem 2rem 2rem 2rem;
      display: grid;
      grid-template-columns: 220px 1fr;
      gap: 2rem;
    }

    /* Columna Foto de Perfil */
    .avatar-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      border-right: 1px solid #f1f5f9;
      padding-right: 2rem;
    }

    .avatar-box {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      border: 3px dashed #cbd5e1;
      background: #f8fafc;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      position: relative;
      transition: all 0.3s;
    }

    .avatar-box:hover {
      border-color: #3b82f6;
      background: #eff6ff;
    }

    .avatar-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .avatar-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      color: #94a3b8;
      font-size: 0.85rem;
      text-align: center;
      padding: 0.5rem;
    }

    .file-input-label {
      background: #f1f5f9;
      color: #475569;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-size: 0.85rem;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s;
    }

    .file-input-label:hover {
      background: #e2e8f0;
    }

    /* Grid de los campos inputs (2 por fila) */
    .fields-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-group label {
      font-size: 0.9rem;
      font-weight: 500;
      color: #475569;
    }

    .form-control {
      padding: 0.65rem 0.75rem;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      font-size: 0.95rem;
      color: #334155;
      background-color: #fff;
      transition: border-color 0.2s;
    }

    .form-control:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    /* Footer de Acciones */
    .modal-footer {
      padding: 1rem 2rem;
      background: #f8fafc;
      border-top: 1px solid #e2e8f0;
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
    }

    .btn-cancelar {
      background: #ffffff;
      border: 1px solid #cbd5e1;
      color: #475569;
      padding: 0.65rem 1.25rem;
      border-radius: 8px;
      font-weight: 500;
      cursor: pointer;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: scale(0.95);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
  `,
})
export class FormularioEstudiante implements OnInit {
  formularioEstudiante!: FormGroup;

  @Output() cerrar = new EventEmitter<void>();

  imagenPreview: string | null = null;
  listaProfesores: any[] = [];

  // Variables de Control de Estado y Errores
  guardando = false;
  mensajeError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private estudianteService: EstudianteService,
    private profesorService: ProfesorService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.formularioEstudiante = this.fb.group({
      documento: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      correo: ['', [Validators.required, Validators.email]],
      imagenUrl: [''],
      profesorId: ['', [Validators.required]],
      estado: [true, [Validators.required]],
    });
    this.cargarProfesores();
  }

  capturarNombreArchivo(event: any) {
    const archivo = event.target.files[0];
    if (archivo) {
      this.formularioEstudiante.patchValue({
        imagenUrl: archivo.name,
      });

      const reader = new FileReader();
      reader.onload = () => {
        this.imagenPreview = reader.result as string;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(archivo);
    }
  }

  cargarProfesores(): void {
    this.profesorService.obtenerProfesores().subscribe({
      next: (data: any) => {
        this.listaProfesores = data.content || data;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error al cargar profesores:', err);
      },
    });
  }

  guardarEstudiante() {
    this.mensajeError = null;

    if (this.formularioEstudiante.invalid) {
      this.mensajeError = 'Por favor completa todos los campos requeridos correctamente.';
      this.formularioEstudiante.markAllAsTouched();
      this.cdr.detectChanges();
      return;
    }

    this.guardando = true;
    const formValues = this.formularioEstudiante.value;
    const hoy = new Date().toISOString().split('T')[0];

    const estudianteRequestBody = {
      id: formValues.id,
      documento: formValues.documento,
      nombre: formValues.nombre,
      apellido: formValues.apellido,
      email: formValues.correo,
      fechaIngreso: hoy,
      imagenUrl: formValues.imagenUrl,
      activo: formValues.estado === 'true' || formValues.estado === true,
      tarifa: { id: 1 },
      profesor: { id: Number(formValues.profesorId) },
    };

    this.estudianteService.registrarEstudiante(estudianteRequestBody)
      .pipe(
        finalize(() => {
          // 🎯 Ocurra lo que ocurra (éxito o error), liberamos el estado de guardando
          this.guardando = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (respuesta) => {
          console.log('✅ ¡Guardado con éxito!', respuesta);
          this.cerrar.emit();
        },
        error: (error) => {
          console.error('🔴 Error al registrar estudiante:', error);

          // Extraemos el mensaje retornado por Spring Boot si existe
          this.mensajeError = error.error?.mensaje
            || 'No se pudo guardar el estudiante. Verifica los datos o la conexión con el servidor.';

          // Forzamos la detección de cambios para evitar que la pantalla se congele
          this.cdr.detectChanges();
        },
      });
  }
}
