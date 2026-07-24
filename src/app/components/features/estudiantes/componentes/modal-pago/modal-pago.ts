import { Component, Input, Output, EventEmitter, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PagoService } from '../../servicios/pago';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-modal-pago',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-pago.html',
  styleUrl: './modal-pago.css',
})
export class ModalPago {
  @Input() mostrar: boolean = false;

  private cdr = inject(ChangeDetectorRef);
  private pagoService = inject(PagoService);

  // Manejo reactivo de alumno
  private _alumno: any = null;

  @Input()
  set alumno(value: any) {
    this._alumno = value;
    if (value) {
      this.prepararFechasPredeterminadas();
    }
  }

  get alumno(): any {
    return this._alumno;
  }

  @Output() alCerrar = new EventEmitter<void>();
  @Output() alGuardarExitoso = new EventEmitter<void>();

  // Variables de control de estado y errores
  guardando: boolean = false;
  mensajeError: string | null = null;

  nuevoPago = {
    fechaPago: '',
    monto: null as number | null,
    fechaVencimiento: '',
    evidencia: '',
  };

  constructor() {
    this.prepararFechasPredeterminadas();
  }

  /**
   * Genera la fecha de hoy para el pago y suma 1 mes para la fecha de vencimiento
   */
  private prepararFechasPredeterminadas(): void {
    const hoy = new Date();

    // Fecha de Pago = Hoy (Formato YYYY-MM-DD)
    const fechaPagoStr = hoy.toISOString().split('T')[0];

    // Fecha de Vencimiento = Próximo mes
    const proximoMes = new Date(hoy);
    proximoMes.setMonth(proximoMes.getMonth() + 1);
    const fechaVencimientoStr = proximoMes.toISOString().split('T')[0];

    this.nuevoPago.fechaPago = fechaPagoStr;
    this.nuevoPago.fechaVencimiento = fechaVencimientoStr;
  }

  cerrar(): void {
    this.resetFormulario();
    this.alCerrar.emit();
  }

  guardar(): void {
    this.mensajeError = null;

    if (!this.nuevoPago.fechaPago || !this.nuevoPago.monto || !this.nuevoPago.fechaVencimiento) {
      this.mensajeError = 'Por favor completa la fecha de pago, el monto y la fecha de vencimiento.';
      this.cdr.detectChanges();
      return;
    }

    if (!this.alumno?.documento) {
      this.mensajeError = 'Error: No se ha seleccionado un alumno válido.';
      this.cdr.detectChanges();
      return;
    }

    this.guardando = true;

    const pagoPayload = {
      fechaPago: this.nuevoPago.fechaPago,
      fechaVencimiento: this.nuevoPago.fechaVencimiento,
      valor: this.nuevoPago.monto,
      evidencia: this.nuevoPago.evidencia?.trim() || 'Sin soporte',
      alumno: {
        documento: this.alumno.documento,
      },
    };

    this.pagoService.registrarPago(pagoPayload)
      .pipe(
        finalize(() => {
          // 🎯 Se ejecuta SIEMPRE (éxito o error) liberando el botón y forzando refresco en Zoneless
          this.guardando = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (response: any) => {
          console.log('¡Pago registrado con éxito en el backend!', response);
          this.alGuardarExitoso.emit();
          this.cerrar();
        },
        error: (err: any) => {
          console.error('Error al registrar el pago en Spring Boot:', err);
          this.mensajeError = err.error?.mensaje || 'Hubo un error al guardar el pago. Verifica los datos enviados.';
          this.cdr.detectChanges();
        },
      });
  }

  private resetFormulario(): void {
    this.mensajeError = null;
    this.guardando = false;
    this.nuevoPago.monto = null;
    this.nuevoPago.evidencia = '';
    this.prepararFechasPredeterminadas();
  }
}
