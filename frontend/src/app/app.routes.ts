import { Routes } from '@angular/router';
import { authGuard } from './guards';

export const routes: Routes = [
  {
    path: 'login',
    title: 'Iniciar sesión',
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
  },
  {
    path: 'register',
    title: 'Registro',
    loadComponent: () => import('./pages/register/register').then((m) => m.Register),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadChildren: () => import('./pages/layout/layout.routes').then((m) => m.routes),
  },
];
