import { Routes } from '@angular/router';
import { Profesores } from './components/features/profesores/profesores/profesores';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full'
  },
  {
    path: 'inicio',
    loadComponent: () => import('./components/shared/inicio/inicio').then(m => m.Inicio)
  },
  {
    path: 'finanzas',
    loadComponent: () => import('./components/features/finanzas/finanzas').then(m => m.Finanzas)
  },
  {
    path: 'estudiantes',
    loadComponent: () => import('./components/features/estudiantes/estudiantes').then(m => m.Estudiantes)
  },
  { path: 'profesores', component: Profesores },
  {
    path: '**',
    redirectTo: 'inicio'
  }

];
