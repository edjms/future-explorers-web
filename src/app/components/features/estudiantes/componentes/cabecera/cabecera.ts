import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-cabecera',
  imports: [],
  templateUrl: './cabecera.html',
  styles: `
    .cabecera-container {
    margin-top: 1.5rem;
      display: flex;
      justify-content: space-between;
      font-family:
        system-ui,
        -apple-system,
        sans-serif;
      max-width: 1300px;
      align-items: center;
    }

    .cabecera-titulo {
      font-size: 1.5rem;
      color: #0f172a;
      margin: 0 0 0.25rem 0;
      font-weight: 700;
    }

    .cabecera-subtitulo {
      color: #64748b;
      margin: 0;
      font-size: 0.8rem;
    }
  `,
})
export class Cabecera {
  @Output() alHacerClicRegistrar = new EventEmitter<void>();
}
