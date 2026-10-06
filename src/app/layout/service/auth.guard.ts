import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { AuthApi } from '../../core/apis/auth.api';
import { LocalStorageService } from '../../core/services/local-storage.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthApi,
    private router: Router,
    private localStorageService: LocalStorageService
  ) {}

  canActivate(): Observable<boolean> {
    // Bước 1: Lấy token từ localStorage
    const token = this.localStorageService.getAppToken();

    if (!token) {
      this.router.navigate(['/login']);
      return of(false);
    }

    // Bước 2: Gọi API kiểm tra token còn hợp lệ không
    return this.authService.introspect({ token }).pipe(
      switchMap((response) => {
        if (this.isTokenValid(response)) {
          // Token hợp lệ → cho phép truy cập
          return of(true);
        }

        // Token hết hạn → thử refresh
        return this.authService.refreshToken({ token }).pipe(
          map(() => true),
          catchError(() => {
            // Refresh thất bại → về trang login
            this.router.navigate(['/login']);
            return of(false);
          })
        );
      }),
      catchError(() => {
        // Introspect thất bại → về trang login
        this.router.navigate(['/login']);
        return of(false);
      })
    );
  }

  /**
   * Chấp nhận cả 2 dạng phản hồi:
   *  - Backend hiện tại: { status: 1, message: 'OK' }  (1 = thành công)
   *  - Dạng chuẩn:       { result: { valid: true } }
   */
  private isTokenValid(response: any): boolean {
    if (
      response?.result &&
      typeof response.result.valid === 'boolean'
    ) {
      return response.result.valid;
    }

    const status = Number(response?.status);
    if (!Number.isNaN(status) && response?.status !== undefined) {
      return status === 1 || (status >= 200 && status < 300);
    }

    const code = Number(response?.code);
    if (!Number.isNaN(code) && response?.code !== undefined) {
      return code === 1 || (code >= 200 && code < 300);
    }

    return !!response;
  }
}