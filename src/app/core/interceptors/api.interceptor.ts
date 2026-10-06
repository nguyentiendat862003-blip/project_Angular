import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AppService } from '../services/app.service';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const appService = inject(AppService);
  const baseUrl = appService.config?.baseUrl;

  if (baseUrl && !req.url.startsWith('http')) {
    req = req.clone({
      url: `${baseUrl}${req.url}`
    });
  }

  return next(req);
};
