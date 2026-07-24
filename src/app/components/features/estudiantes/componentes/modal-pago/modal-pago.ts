import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PagoService } from '../../servicios/pago';

@Component({
  selector: 'app-modal-pago',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-pago.html',
  styleUrl: './modal-pago.css',
})
export class ModalPago {
  @Input() mostrar: boolean = false;

  // Manejo reactivo de alumno para calcular la fecha de vencimiento por defecto
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

  nuevoPago = {
    fechaPago: '',
    monto: null,
    fechaVencimiento: '',
    evidencia: '',
  };

  constructor(private pagoService: PagoService) {
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
    if (!this.nuevoPago.fechaPago || !this.nuevoPago.monto || !this.nuevoPago.fechaVencimiento) {
      alert('Por favor completa la fecha de pago, el monto y la fecha de vencimiento.');
      return;
    }

    if (!this.alumno?.documento) {
      alert('Error: No se ha seleccionado un alumno válido.');
      return;
    }

    const pagoPayload = {
      fechaPago: this.nuevoPago.fechaPago,
      fechaVencimiento: this.nuevoPago.fechaVencimiento,
      valor: this.nuevoPago.monto,
      evidencia: this.nuevoPago.evidencia?.trim() || 'Sin soporte',
      alumno: {
        documento: this.alumno.documento,
      },
    };

    this.pagoService.registrarPago(pagoPayload).subscribe({
      next: (response: any) => {
        console.log('¡Pago registrado con éxito en el backend!', response);
        this.alGuardarExitoso.emit();
        this.cerrar();
      },
      error: (err: any) => {
        console.error('Error al registrar el pago en Spring Boot:', err);
        alert('Hubo un error al guardar el pago. Revisa la consola.');
      },
    });
  }

  private resetFormulario(): void {
    this.nuevoPago.monto = null;
    this.nuevoPago.evidencia = '';
    this.prepararFechasPredeterminadas();
  }
}
