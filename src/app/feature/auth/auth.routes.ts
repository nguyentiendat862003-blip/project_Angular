import { Routes } from '@angular/router';

export default [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('../auth/pages/login').then((c) => c.LoginComponent),
  },
  { path: '**', redirectTo: 'login' },
] as Routes