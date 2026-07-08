import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-modal-editar',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modal-editar.html',
  styleUrl: './modal-editar.css',
})
export class ModalEditar implements OnInit {
  @Input() estudiante: any = null;
  @Output() cerrar = new EventEmitter<void>();
  @Output() edicionExitosa = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  form!: FormGroup;

  ngOnInit(): void {
    this.form = this.fb.group({
      // Ahora la cédula es un campo editable común y corriente
      documento: [this.estudiante?.documento || '', Validators.required],
      nombre: [this.estudiante?.nombre || '', Validators.required],
      apellido: [this.estudiante?.apellido || '', Validators.required],
      email: [this.estudiante?.email || '', [Validators.required, Validators.email]],
      // Campo para la fecha de nacimiento (se mapeará al input tipo date)
      fechaNacimiento: [this.estudiante?.fechaNacimiento || ''],
      // Campo para controlar la imagen o foto
      imagenUrl: [this.estudiante?.imagenUrl || 'no se tiene aun'],
      profesorId: [this.estudiante?.profesor?.id || '', Validators.required],
      activo: [this.estudiante?.activo ?? true]
    });
  }

  // 🎯 ASEGÚRATE DE QUE ESTE MÉTODO EXISTE AQUÍ INSIDE:
  guardar(): void {
    if (this.form.valid) {
      console.log('Datos listos para mandar a Spring Boot:', this.form.value);
      this.edicionExitosa.emit();
      this.cerrar.emit();
    }
  }

  // 🎯 Y ESTE TAMBIÉN, QUE ES EL QUE TE PIDE EL ERROR:
  cancelar(): void {
    this.cerrar.emit();
  }
}
