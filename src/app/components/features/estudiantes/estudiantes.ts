import { Component } from '@angular/core';
import { Cabecera } from './componentes/cabecera/cabecera';
import {Buscador} from './componentes/buscador/buscador'
import { TablaEstudiantes } from './componentes/tabla-estudiantes/tabla-estudiantes';
@Component({
  selector: 'app-estudiantes',
  imports: [Cabecera,Buscador, TablaEstudiantes],
  templateUrl: './estudiantes.html',
  styleUrl: './estudiantes.css',
})
export class Estudiantes {}
