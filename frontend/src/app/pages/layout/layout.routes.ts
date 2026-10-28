import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout').then((m) => m.Layout),
    children: [
      {
        path: '',
        title: 'Inicio',
        loadComponent: () => import('./feed/feed').then((m) => m.Feed),
      },
    ],
  },
];
