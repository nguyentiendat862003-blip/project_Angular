import { Routes } from '@angular/router';

export default [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('../auth/pages/login').then((c) => c.Login),
  },
  // KHÔNG để path '**' ở đây: route cha '' khớp mọi URL nên wildcard con sẽ
  // nuốt hết đường dẫn sai, khiến trang 404 không bao giờ được gọi tới.
] as Routes
