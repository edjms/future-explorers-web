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
  /* 🟢 ÚNICO CAMBIO: El estilo de letra limpio y moderno de finanzas */
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.cabecera-titulo {
  font-size: 1.75rem;
  color: #0f172a;
  margin: 0 0 0.25rem 0;
  font-weight: 700;
  letter-spacing: -0.02em; /* Ajuste sutil para que los títulos grandes se vean impecables con esta letra */
}

.cabecera-subtitulo {
  color: #64748b;
  margin: 0;
  font-size: 0.95rem;
  letter-spacing: -0.01em;
}`,
})
export class Cabecera {
  @Output() alHacerClicRegistrar = new EventEmitter<void>();
}
