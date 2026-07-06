import { Component,ViewChild } from '@angular/core';
import { Cabecera } from './componentes/cabecera/cabecera';
import {Buscador} from './componentes/buscador/buscador'
import { TablaEstudiantes } from './componentes/tabla-estudiantes/tabla-estudiantes';
import { FormularioEstudiante } from './componentes/formulario-estudiante/formulario-estudiante';

@Component({
  selector: 'app-estudiantes',
  imports: [Cabecera, Buscador, TablaEstudiantes, FormularioEstudiante],
  templateUrl: './estudiantes.html',
  styleUrl: './estudiantes.css',
})
export class Estudiantes {
  mostrarModal: boolean = false;

  //@ViewChild(TablaEstudiantes) tablaEstudiantes!: TablaEstudiantes;

/*
  refrescarTablaDesdeBuscador(): void {
    if (this.tablaEstudiantes) {
      this.tablaEstudiantes.cargarAlumnos(); // ¡Llamamos al método que sí existe en la tabla!
    }
  }*/

  abrirFormulario() {
    this.mostrarModal = true;
  }

  cerrarFormulario() {
    this.mostrarModal = false;
  }
}
