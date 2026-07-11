import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, NgFor } from '@angular/common';
import { EstudianteService } from '../../servicios/estudiante';
import { ProfesorService } from '../../../profesores/servicios/profesor';


@Component({
  selector: 'app-formulario-estudiante',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ReactiveFormsModule,
    CommonModule, // 👈 Debe estar aquí adentro
    NgFor,
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
      background: rgba(15, 23, 42, 0.6); /* Backdrop elegante */
      backdrop-filter: blur(4px);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
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

    /* Formulario Layout: 2 Columnas (Izquierda Foto, Derecha Campos) */
    .modal-body-form {
      padding: 2rem;
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
      gap: 1.25rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-group-full {
      grid-column: span 2;
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
      padding: 1.25rem 2rem;
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

    .btn-guardar {
      background: #2563eb;
      border: none;
      color: #ffffff;
      padding: 0.65rem 1.25rem;
      border-radius: 8px;
      font-weight: 500;
      cursor: pointer;
    }

    .btn-guardar:hover {
      background: #1d4ed8;
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

    .avatar-img {
      width: 100%;
      height: 100%;
      object-fit: cover; /* 🎯 Esto hace que la foto se recorte proporcionalmente al círculo */
    }
  `,
})
export class FormularioEstudiante implements OnInit {
  formularioEstudiante!: FormGroup;

  @Output() cerrar = new EventEmitter<void>();

  imagenPreview: string | null = null;
  listaProfesores: any[] = [];

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
      // 1. Guardamos el nombre del archivo en el formulario para enviarlo al backend
      this.formularioEstudiante.patchValue({
        imagenUrl: archivo.name,
      });

      // 2. 🎯 LA MAGIA: Leemos el archivo real para generar la vista previa visual
      const reader = new FileReader();
      reader.onload = () => {
        this.imagenPreview = reader.result as string; // Guardamos la URL en base64
        this.cdr.detectChanges(); // Forzamos a Angular a redibujar la imagen de inmediato
      };
      reader.readAsDataURL(archivo);
    }
  }
  cargarProfesores(): void {
    this.profesorService.obtenerProfesores().subscribe({
      next: (data: any) => {
        console.log('Respuesta cruda de profesores:', data); // 👈 ¡Añade esto!
        this.listaProfesores = data.content || data;
        console.log('Lista procesada asignada al formulario:', this.listaProfesores); // 👈 Y esto!
      },
      error: (err: any) => {
        console.error('Error al cargar profesores en el formulario de registro', err);
      },
    });
  }


  guardarEstudiante() {
    if (this.formularioEstudiante.valid) {
      const formValues = this.formularioEstudiante.value;
      const hoy = new Date().toISOString().split('T')[0];

      // 🏗️ Armamos el objeto con los datos reales del formulario
      const estudianteRequestBody = {
        id: formValues.id,
        documento: formValues.documento,
        nombre: formValues.nombre,
        apellido: formValues.apellido,
        email: formValues.correo,
        fechaIngreso: hoy,
        imagenUrl: formValues.imagenUrl,
        activo: formValues.estado === 'true' || formValues.estado === true,

        // ⚠️ TEMPORAL: Se dejan estos IDs fijos (1) porque aún no hemos
        // creado los servicios en Angular para listar profesores y tarifas reales.
        tarifa: {
          id: 1,
        },
        profesor: {
          id: Number(formValues.profesorId),
        },
      };

      console.log('🚀 Despachando estructura gigante al servicio...', estudianteRequestBody);

      this.estudianteService.registrarEstudiante(estudianteRequestBody).subscribe({
        next: (respuesta) => {
          console.log('✅ ¡Guardado con éxito en el Backend!', respuesta);
          alert('¡Estudiante guardado correctamente!');
          this.cerrar.emit();
        },
        error: (error) => {
          console.error('🔴 Error al conectar con Spring Boot:', error);
          alert('No se pudo guardar el estudiante. Revisa la consola.');
        },
      });
    } else {
      alert('Por favor, rellena todos los campos correctamente.');
    }
  }
}
  /*guardarEstudiante() {
    if (this.formularioEstudiante.valid) {
      const datosEstudiante = this.formularioEstudiante.value;
      console.log('Entregando datos al servicio...', datosEstudiante);
      this.estudianteService.registrarEstudiante(datosEstudiante).subscribe({
        next: (respuesta) => {
          console.log('¡✅ Guardado con éxito en el Backend!', respuesta);
          alert('¡Estudiante guardado correctamente!');
          this.cerrar.emit();
        },
        error: (error) => {
          // ❌ Si el Backend está apagado o falla:
          console.error('🔴 Error al conectar con Spring Boot:', error);
          alert('No se pudo guardar el estudiante. (¿Está encendido el Backend?)');
          this.cerrar.emit(); // Cerramos el modal de todos modos por ahora
        },
      });
      this.cerrar.emit();
    } else {
      alert('Por favor, rellena todos los campos correctamente.');
    }
  }**/

