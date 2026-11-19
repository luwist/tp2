import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./admin').then((m) => m.Admin),
    children: [
      {
        path: '',
        loadComponent: () => import('./users/users').then((m) => m.Users),
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard').then((m) => m.Dashboard),
      },
    ],
  },
];
