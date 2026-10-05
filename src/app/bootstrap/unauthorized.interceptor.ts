import { Injectable, Provider } from '@angular/core';
import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpStatusCode,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { Observable, BehaviorSubject, catchError, filter, finalize, switchMap, take, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthApi } from '../core/apis/auth.api';
import { LocalStorageService } from '../core/services/local-storage.service';
import { LocalStorageKey } from '../shared/models/const.model';

@Injectable()
export class UnauthorizedInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  constructor(
    private authApi: AuthApi,
    private router: Router,
    private localStorageService: LocalStorageService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    return next.handle(req).pipe(
      catchError((err) => {
        // Chỉ xử lý lỗi 401 và không phải là request refresh
        if (
          err.status === HttpStatusCode.Unauthorized &&
          !req.url.includes('/auth/refresh')
        ) {
          // Nếu đang refresh → chờ token mới
          if (!this.isRefreshing) {
            this.isRefreshing = true;
            this.refreshTokenSubject.next(null);

            const token = this.localStorageService.getAppToken();
            return this.authApi.refreshToken({ token }).pipe(
              switchMap((response) => {
                const newToken = response.result.accessToken;
                this.localStorageService.setItem(
                  LocalStorageKey.APP_ACCESS_TOKEN,
                  newToken
                );
                this.refreshTokenSubject.next(newToken);
                // Thử lại request cũ với token mới
                return next.handle(this.addTokenHeader(req, newToken));
              }),
              catchError((refreshError) => {
                // Refresh thất bại → về login
                this.router.navigate(['/login']);
                return throwError(() => refreshError);
              }),
              finalize(() => (this.isRefreshing = false))
            );
          } else {
            // Đang refresh → chờ
            return this.refreshTokenSubject.pipe(
              filter((token) => token !== null),
              take(1),
              switchMap((token) =>
                next.handle(this.addTokenHeader(req, token!))
              )
            );
          }
        }

        return throwError(() => err);
      })
    );
  }

  private addTokenHeader(
    req: HttpRequest<any>,
    token: string
  ): HttpRequest<any> {
    return req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }
}

export const unauthorizedInterceptorProvider: Provider = {
  provide: HTTP_INTERCEPTORS,
  useClass: UnauthorizedInterceptor,
  multi: true,
};