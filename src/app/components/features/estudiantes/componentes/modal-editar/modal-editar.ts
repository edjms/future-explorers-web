import { Component, Input, Output, EventEmitter, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EstudianteService } from '../../servicios/estudiante';
import { ProfesorService } from '../../../profesores/servicios/profesor';
import { ProfesorModel } from '../../../../../models/profesor.model';
import { TarifaModel } from '../../../../../models/tarifa.model';
import { Tarifa } from '../../servicios/tarifa';
import { environment } from '../../../../../../environments/environment';

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


  form!: FormGroup;
  listaProfesores: ProfesorModel[] = [];
  listaTarifa: TarifaModel[] = [];
  imagenPreview: string | null = null; // 🎯 Para controlar la vista previa en base64 de la foto
  urlFotos = environment.urlPictures;

  private fb = inject(FormBuilder);
  private estudianteService = inject(EstudianteService);
  private profesorService = inject(ProfesorService);
  private tarifaService = inject(Tarifa);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.inicializarFormularioVacio();
    this.cargarProfesores();
    this.cargarTarifa();

    if (this.estudiante && this.estudiante.documento) {
      this.cargarDetalleEstudiante(this.estudiante.documento.toString());
    } else {
      console.error('No se pudo abrir el modal porque no se recibió el documento del estudiante.');
    }
  }


  inicializarFormularioVacio(): void {
    this.form = this.fb.group({
      documento: ['', Validators.required],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono:['',Validators.required],
      fechaNacimiento: [''],
      imagenUrl: ['no se tiene aun'],
      profesorId: ['', Validators.required],
      tarifaId: ['', Validators.required],
      activo: [true],
    });
  }

  cargarDetalleEstudiante(documento: string): void {
    this.estudianteService.obtenerEstudiantePorDocumento(documento).subscribe({
      next: (estudianteCompleto: any) => {
        console.log('¡Datos completos traídos por Documento!', estudianteCompleto);

        this.estudiante.id = estudianteCompleto.id;
        this.form.patchValue({
          documento: estudianteCompleto.documento,
          nombre: estudianteCompleto.nombre,
          apellido: estudianteCompleto.apellido,
          email: estudianteCompleto.email || estudianteCompleto.correo,
          telefono: estudianteCompleto.telefono ?? '',
          fechaNacimiento: estudianteCompleto.fechaNacimiento,
          imagenUrl: estudianteCompleto.imagenUrl,
          profesorId: estudianteCompleto.profesor?.id || '',
          tarifaId: estudianteCompleto.tarifa?.id || '',
          activo: estudianteCompleto.activo ?? true,
        });

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
      next: (data: ProfesorModel[]) => {
        this.listaProfesores = data;
        this.cdr.detectChanges(); // Asegura que el desplegable se entere del cambio
      },
      error: (err: any) => {
        console.error('Error al cargar profesores desde el backend', err);
      },
    });
  }

  cargarTarifa(): void {
    this.tarifaService.obtenerTarifa().subscribe({
      next: (data: TarifaModel[]) => {
        this.listaTarifa = data;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error al cargar tarifas:', err);
      },
    });
  }

  capturarNombreArchivo(event: any): void {
    const archivo = event.target.files[0];
    if (archivo) {
      // Guardamos el nombre del archivo en el control del formulario
      this.form.patchValue({
        imagenUrl: archivo.name,
      });

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
    const estudianteAEnviar = {
      documento: valoresFormulario.documento,
      nombre: valoresFormulario.nombre,
      apellido: valoresFormulario.apellido,
      email: valoresFormulario.email,
      telefono: valoresFormulario.telefono ? String(valoresFormulario.telefono).trim() : null,
      fechaNacimiento: valoresFormulario.fechaNacimiento,
      imagenUrl: valoresFormulario.imagenUrl,
      activo: valoresFormulario.activo,
      profesor: {
        id: Number(valoresFormulario.profesorId),
      },
      tarifa: {
        id: Number(valoresFormulario.tarifaId),
      },
    };

    this.estudianteService.actualizarEstudiante(idEstudiante, estudianteAEnviar).subscribe({
      next: (response) => {
        console.log('¡Actualizado con éxito!', response);
        this.cerrar.emit();
        this.edicionExitosa.emit();
        this.cdr.detectChanges(); // Notifica a la tabla que recargue los datos
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
