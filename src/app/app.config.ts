import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { appRoutes } from './app.routes';
import { authInterceptorProvider } from './bootstrap/auth.interceptor';
import { unauthorizedInterceptorProvider } from './bootstrap/unauthorized.interceptor';
import { AppService } from './core/services/app.service';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { MessageService } from 'primeng/api';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { apiInterceptor } from './core/interceptors/api.interceptor';

// Load config trước khi app khởi động
const initializerConfigFn = () => {
  const configService = inject(AppService);
  return configService.loadAppConfig();
};

export const appConfig: ApplicationConfig = {
  providers: [
    // Interceptors
    authInterceptorProvider,
    unauthorizedInterceptorProvider,

    // Angular features
    provideAnimationsAsync(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideHttpClient(
      withFetch(),
      withInterceptorsFromDi(),
      // Nối baseUrl (từ web_config.json) vào các request API
      withInterceptors([apiInterceptor])
    ),

    // PrimeNG
    providePrimeNG({
      theme: { preset: Aura, options: { darkModeSelector: '.app-dark' } },
      ripple: true,
      translation: {
        dayNames: [
          'Chủ Nhật',
          'Thứ Hai',
          'Thứ Ba',
          'Thứ Tư',
          'Thứ Năm',
          'Thứ Sáu',
          'Thứ Bảy',
        ],
        dayNamesShort: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
        monthNames: [
          'Tháng Một',
          'Tháng Hai',
          'Tháng Ba',
          'Tháng Tư',
          'Tháng Năm',
          'Tháng Sáu',
          'Tháng Bảy',
          'Tháng Tám',
          'Tháng Chín',
          'Tháng Mười',
          'Tháng Mười Một',
          'Tháng Mười Hai',
        ],
        monthNamesShort: [
          'Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6',
          'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12',
        ],
        today: 'Hôm nay',
        clear: 'Xóa',
        dateFormat: 'dd/mm/yy',
        firstDayOfWeek: 1,
      },
    }),

    // Load config khi khởi động app
    provideAppInitializer(initializerConfigFn),

    // Toast
    MessageService,
  ],
};