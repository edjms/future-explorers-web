import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-formulario-estudiante',
  imports: [],
  templateUrl: './formulario-estudiante.html',
  styles: ``,
})
export class FormularioEstudiante {
  @Output() cerrar = new EventEmitter<void>();

  guardarEstudiante() {
    alert('¡Guardando estudiante de prueba!');
    this.cerrar.emit();
  }
}
