import { Routes } from '@angular/router';
import { AuthGuard } from './layout/service/auth.guard';
import { AppLayout } from './layout/component/app.layout';

export const appRoutes: Routes = [
  // Trang chính (cần đăng nhập)
  {
    path: 'home',
    component: AppLayout,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./feature/home/home.component').then(
            (m) => m.HomeComponent
          ),
      },
      {
        path: 'welcome',
        loadComponent: () =>
          import('./feature/welcome/welcome.component').then(
            (m) => m.WelcomeComponent
          ),
      },
    ],
  },

  // Trang 404
  {
    path: 'notfound',
    loadComponent: () =>
      import('./feature/notfound/notfound.component').then((m) => m.Notfound),
  },

  // Auth (không cần đăng nhập) - trang đầu tiên khi mở app
  {
    path: '',
    loadChildren: () => import('./feature/auth/auth.routes'),
  },

  // Fallback: mọi đường dẫn sai → 404
  { path: '**', redirectTo: '/notfound' },
];