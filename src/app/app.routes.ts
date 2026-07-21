import { Routes } from '@angular/router';
import { Profesores } from './components/features/profesores/profesores/profesores';
import { Login } from './components/features/auth/login/login';
import { authGuard } from './components/features/auth/guards/auth-guard';
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./components/features/auth/login/login').then((m) => m.Login),
  },
  {
    path: 'inicio',
    canActivate: [authGuard],
    loadComponent: () => import('./components/shared/inicio/inicio').then((m) => m.Inicio),
  },
  {
    path: 'finanzas',
    canActivate: [authGuard],
    loadComponent: () => import('./components/features/finanzas/finanzas').then((m) => m.Finanzas),
  },
  {
    path: 'estudiantes',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/features/estudiantes/estudiantes').then((m) => m.Estudiantes),
  },
  { path: 'profesores',
    component: Profesores,
    canActivate: [authGuard] },
  {
    path: '**',
    redirectTo: 'login',
  },
];
