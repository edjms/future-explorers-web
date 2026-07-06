import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EstudianteService } from '../../servicios/estudiante';


@Component({
  selector: 'app-buscador',
  imports: [FormsModule, CommonModule],
  templateUrl: './buscador.html',
  styles: `
    .buscador-container {
      margin-bottom: 2rem;
      width: 100%;
    }

    .input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
      max-width: 500px; /* Para que no se estire feo por toda la pantalla */
    }

    .icono-lupa {
      position: absolute;
      left: 14px;
      font-size: 1.1rem;
      color: #94a3b8;
      pointer-events: none; /* Para que no interfiera al hacer clic */
    }

    .input-busqueda {
      width: 100%;
      padding: 0.75rem 1rem 0.75rem 2.5rem; /* Espacio extra a la izquierda para la lupa */
      font-size: 0.95rem;
      color: #0f172a;
      background-color: #f8fafc; /* Fondo gris muy sutil */
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      outline: none;
      transition: all 0.2s ease;
    }

    /* Efecto cuando el usuario hace clic para escribir */
    .input-busqueda:focus {
      background-color: #ffffff;
      border-color: #38bdf8; /* Cambia al azul cian de la app */
      box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.15);
    }
  `,
})
export class Buscador {
  //@Output() alActualizar = new EventEmitter<void>();

  terminoBusqueda: string = '';
  estudianteEncontrado: any = null;

  constructor(private estudianteService: EstudianteService) {}

  ejecutarBusqueda() {
    if (!this.terminoBusqueda.trim()) {
      this.estudianteEncontrado = null;
      return;
    }

    this.estudianteService.obtenerEstudiantePorDocumento(this.terminoBusqueda).subscribe({
      next: (resultado: any) => {
        this.estudianteEncontrado = resultado;
      },
      error: (err: any) => {
        console.error('🔴 Error al buscar:', err);
        this.estudianteEncontrado = null;
      },
    });
  }

}
