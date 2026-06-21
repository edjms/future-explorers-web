import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-formulario-estudiante',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './formulario-estudiante.html',
  styles: ``,
})
export class FormularioEstudiante {
  @Output() cerrar = new EventEmitter<void>();

  formularioEstudiante: FormGroup;

  constructor(private fb: FormBuilder) {
    this.formularioEstudiante = this.fb.group({
      nombre: ['', [  Validators.required, Validators.minLength(3)]], // Nombre obligatorio, mínimo 3 letras
      correo: ['', [Validators.required, Validators.email]], // Correo obligatorio y con formato válido
      estado: ['true', Validators.required], // Estado por defecto en 'Activo' (true)
    });
  }
  guardarEstudiante() {
    if (this.formularioEstudiante.valid) {
      const datosEstudiante = this.formularioEstudiante.value;
      console.log('🚀 DATOS LISTOS PARA SPRING BOOT:', datosEstudiante);
      this.cerrar.emit();
    } else {
      alert('Por favor, rellena todos los campos correctamente.');
    }
  }
}
