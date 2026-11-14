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
      {
        path: ':username',
        title: 'Profile',
        loadComponent: () => import('./profile/profile').then((m) => m.Profile),
      },
      {
        path: 'posts/:id',
        title: 'Publicacion',
        loadComponent: () => import('./post-detail/post-detail').then((m) => m.PostDetail),
      },
    ],
  },
];
