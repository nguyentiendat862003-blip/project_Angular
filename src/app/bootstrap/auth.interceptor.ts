import { Injectable, Provider } from '@angular/core';
import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { LocalStorageService } from '../core/services/local-storage.service';
import { LocalStorageKey } from '../shared/models/const.model';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private localStorageService: LocalStorageService) {}

  private readonly publicUrls: string[] = [
    '/auth/token',
    '/auth/logout',
    '/auth/refresh',
  ];

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<any> {
    // Bỏ qua các URL public (không cần token)
    if (this.publicUrls.some((url) => req.url.includes(url))) {
      return next.handle(req);
    }

    // Lấy token từ localStorage
    const token = this.localStorageService.getItem(
      LocalStorageKey.APP_ACCESS_TOKEN
    );

    if (!token) {
      return next.handle(req);
    }

    // Thêm token vào header
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    });

    return next.handle(authReq);
  }
}

export const authInterceptorProvider: Provider = {
  provide: HTTP_INTERCEPTORS,
  useClass: AuthInterceptor,
  multi: true,
};