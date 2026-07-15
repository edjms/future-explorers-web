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
      margin-bottom: 1rem;
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
  `,
})
export class Cabecera {
  @Output() alHacerClicRegistrar = new EventEmitter<void>();
}
