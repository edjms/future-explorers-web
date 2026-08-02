import { Component, inject, signal, OnInit } from '@angular/core'; // 👈 1. Agregamos OnInit
import { Navbar } from './components/shared/navbar/navbar';
import { Router, RouterOutlet } from '@angular/router';
import { Auth } from './components/features/auth/servicios/auth';
import { environment } from '../environments/environment'; // 👈 2. Importamos tu environment

@Component({
  selector: 'app-root',
  imports: [Navbar, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit { // 👈 3. Implementamos OnInit
  //protected readonly title = signal('future-explorers-web');
  auth = inject(Auth);
  private router = inject(Router);

  ngOnInit(): void {
    // 4. Le preguntamos a Electron por las URLs del config.json
    if (typeof window !== 'undefined' && (window as any).require) {
      try {
        const { ipcRenderer } = (window as any).require('electron');

        // Reemplazamos la URL de la API en caliente con la del config.json
        ipcRenderer.invoke('get-api-url').then((url: string) => {
          if (url) {
            environment.apiUrl = url;
            console.log('🔗 URL de API cargada desde config.json:', environment.apiUrl);
          }
        });

        // Reemplazamos la ruta de fotos en caliente con la del config.json
        ipcRenderer.invoke('get-url-pictures').then((pictures: string) => {
          if (pictures) {
            environment.urlPictures = pictures;
          }
        });

      } catch (e) {
        console.error('Error al cargar la configuración de Electron:', e);
      }
    }
  }

  esPaginaLogin(): boolean {
    return this.router.url.includes('/login');
  }
}
