import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EstudianteService } from '../../servicios/estudiante';

@Component({
  selector: 'app-formulario-estudiante',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './formulario-estudiante.html',
  styles: ``,
})
export class FormularioEstudiante implements OnInit {

  formularioEstudiante!: FormGroup;

  @Output() cerrar = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
    private estudianteService: EstudianteService,
  ) {}

  ngOnInit(): void {
    this.formularioEstudiante = this.fb.group({
      documento: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      correo: ['', [Validators.required, Validators.email]],
      estado: [true, [Validators.required]]
    });
  }

  guardarEstudiante() {
    if (this.formularioEstudiante.valid) {
      const formValues = this.formularioEstudiante.value;
      const hoy = new Date().toISOString().split('T')[0];

      // 🏗️ Armamos el objeto con los datos reales del formulario
      const estudianteRequestBody = {
        documento: formValues.documento,
        nombre: formValues.nombre,
        apellido: formValues.apellido,
        email: formValues.correo,
        fechaIngreso: hoy,
        fechaVencimiento: hoy,
        activo: formValues.estado === 'true' || formValues.estado === true,

        // ⚠️ TEMPORAL: Se dejan estos IDs fijos (1) porque aún no hemos
        // creado los servicios en Angular para listar profesores y tarifas reales.
        tarifa: {
          id: 1
        },
        profesor: {
          id: 1
        }
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
        }
      });

    } else {
      alert('Por favor, rellena todos los campos correctamente.');
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
}
