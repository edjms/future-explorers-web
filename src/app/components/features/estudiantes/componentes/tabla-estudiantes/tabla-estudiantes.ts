import { Component } from '@angular/core';

@Component({
  selector: 'app-tabla-estudiantes',
  imports: [],
  templateUrl: './tabla-estudiantes.html',
  styles: `.tabla-container {
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
    border: 1px solid #e2e8f0;
    overflow: hidden; /* Para que los bordes redondeados corten la tabla */
    width: 100%;
  }

  .tabla-estudiantes {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
    font-size: 0.95rem;
  }

  .tabla-estudiantes th {
    background-color: #f8fafc;
    color: #475569;
    font-weight: 600;
    padding: 1rem 1.5rem;
    border-bottom: 2px solid #e2e8f0;
  }

  .tabla-estudiantes td {
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #f1f5f9;
    color: #334155;
  }

  /* Efecto Hover en las filas */
  .tabla-estudiantes tbody tr:hover {
    background-color: #f8fafc;
  }

  /* Alineaciones útiles */
  .text-center { text-align: center !important; }

  /* Óvalos de Estado (Badges) */
  .badge {
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.8rem;
    font-weight: 600;
  }
  .badge-activo {
    background-color: #dcfce7;
    color: #15803d;
  }
  .badge-inactivo {
    background-color: #fee2e2;
    color: #b91c1c;
  }

  /* Botones de Acción (Iconos) */
  .btn-accion {
    background: none;
    border: none;
    font-size: 1.1rem;
    cursor: pointer;
    padding: 0.25rem 0.5rem;
    border-radius: 6px;
    transition: background-color 0.2s;
    margin: 0 0.25rem;
  }
  .btn-editar:hover { background-color: #e0f2fe; }
  .btn-eliminar:hover { background-color: #fee2e2; }
  `,
})
export class TablaEstudiantes {}
