import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EstudianteService } from '../../features/estudiantes/servicios/estudiante';
import { environment } from '../../../../environments/environment';


@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio implements OnInit {
  totalExploradores: number = 0;
  cargandoTotal: boolean = true;

  constructor(private estudiantesService: EstudianteService,private cdr: ChangeDetectorRef  ) {}
  urlPicture = environment.urlPictures;
  ngOnInit(): void {
    this.obtenerCantidadExploradores();
  }

  obtenerCantidadExploradores(): void {
    this.estudiantesService.obtenerTotalAlumnos().subscribe({
      next: (total: number) => {
        console.log('✅ Total obtenido con éxito:', total);
        this.totalExploradores = total;
        this.cargandoTotal = false;
        this.cdr.detectChanges();
      },
      error: (err: unknown) => {
        console.error('❌ Error recibido en Inicio:', err);
        // Asignamos 0 para que no se quede infinitamente cargando si la API falla
        this.totalExploradores = 0;
        this.cargandoTotal = false;
        this.cdr.detectChanges();
      },
    });
  }
}
