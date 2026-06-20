import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-cabecera',
  imports: [],
  templateUrl: './cabecera.html',
  styles: `
    .cabecera-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 1.5rem;
    }

    .cabecera-titulo {
      font-size: 1.75rem;
      color: #0f172a;
      margin: 0 0 0.25rem 0;
      font-weight: 700;
    }

    .cabecera-subtitulo {
      color: #64748b;
      margin: 0;
      font-size: 0.95rem;
    }

    .btn-registrar {
      background-color: #38bdf8 !important; /* El azul cian */
      color: #0f172a !important;
      border: none;
      padding: 0.75rem 1.5rem;
      font-size: 0.95rem;
      font-weight: 600;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.2s ease;
    }

    .btn-registrar:hover {
      background-color: #0ea5e9 !important; /* Azul más oscuro al pasar el mouse */
      transform: translateY(-1px);
    }
  `,
})
export class Cabecera {
  @Output() alHacerClicRegistrar = new EventEmitter<void>();
}
