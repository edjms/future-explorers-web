import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PagoService } from '../../servicios/pago';

@Component({
  selector: 'app-modal-pago',
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-pago.html',
  styleUrl: './modal-pago.css',
})
export class ModalPago {
  @Input() mostrar: boolean = false;
  @Input() alumno: any = null;

  @Output() alCerrar = new EventEmitter<void>();
  @Output() alGuardarExitoso = new EventEmitter<void>();

  nuevoPago = {
    fechaPago: new Date().toISOString().split('T')[0],
    monto: null,
    fechaVencimiento: '',
    evidencia: '',
  };

  constructor(private pagoService: PagoService) {}
  ngOnInit(): void {
  }

  cerrar(): void {
    this.resetFormulario();
    this.alCerrar.emit();
  }

  guardar(): void {
    if (!this.nuevoPago.fechaPago || !this.nuevoPago.monto || !this.nuevoPago.fechaVencimiento)
      return;

    const pagoPayload = {
      fechaPago: this.nuevoPago.fechaPago,
      fechaVencimiento: this.nuevoPago.fechaVencimiento,
      valor: this.nuevoPago.monto,
      evidencia: this.nuevoPago.evidencia || 'Sin soporte', // Si lo dejan vacío, manda un texto por defecto
      alumno: {
        documento: this.alumno.documento,
      },
    };

    console.log('JSON final con evidencia listo para enviar:', pagoPayload);

    this.pagoService.registrarPago(pagoPayload).subscribe({
      next: (response: any) => {
        console.log('¡Pago registrado con éxito en el backend!', response);
        this.alGuardarExitoso.emit(); // Le avisa a la tabla que se refresque
        this.cerrar(); // Cierra el modal
      },
      error: (err: any) => {
        console.error('Error al registrar el pago en Spring Boot:', err);
        alert('Hubo un error al guardar el pago. Revisa la consola.');
      },
    });
  }

  private resetFormulario(): void {
    this.nuevoPago = {
      fechaPago: new Date().toISOString().split('T')[0],
      monto: null,
      fechaVencimiento: '',
      evidencia: '',
    };
  }
}
