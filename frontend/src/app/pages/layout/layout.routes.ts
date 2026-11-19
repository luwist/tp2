import { Routes } from '@angular/router';
import { adminGuard } from '@app/guards';

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
        path: 'admin',
        title: 'Administracion',
        canActivate: [adminGuard],
        loadChildren: () => import('./admin/admin.routes').then((m) => m.routes),
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
