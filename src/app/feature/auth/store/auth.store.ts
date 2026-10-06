import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { tap, exhaustMap, finalize, catchError, of } from 'rxjs';
import { AuthApi } from '../../../core/apis/auth.api';
import { ToastService } from '../../../core/services/toast.service';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { LocalStorageKey } from '../../../shared/models/const.model';
import { LoginRequest } from '../../../shared/models/login.model';
import { Router } from '@angular/router';

export interface AuthState {
  loginInfo: any;
  pageLoading: { [key: string]: boolean };
  errorMessage: string | null;
}

@Injectable({ providedIn: 'root' })
export class AuthStore extends ComponentStore<AuthState> {
  // ========== SELECTORS ==========
  readonly loginInfo$ = this.select((s) => s.loginInfo);
  readonly pageLoading$ = this.select((s) => s.pageLoading);
  readonly errorMessage$ = this.select((s) => s.errorMessage);

  readonly vm$ = this.select(
    this.loginInfo$,
    this.pageLoading$,
    this.errorMessage$,
    (loginInfo, pageLoading, errorMessage) => ({
      loginInfo,
      pageLoading,
      errorMessage,
    })
  );

  constructor(
    private authApi: AuthApi,
    private toast: ToastService,
    private router: Router,
    private localStorageService: LocalStorageService
  ) {
    super({
      loginInfo: null,
      pageLoading: {},
      errorMessage: null,
    });
  }

  // ========== EFFECTS ==========
  readonly login = this.effect<{ payload: LoginRequest }>((loginInfo$) =>
    loginInfo$.pipe(
      tap(() =>
        this.patchState({
          pageLoading: { isLoading: true },
          errorMessage: null,
        })
      ),
      exhaustMap((loginInfo) =>
        this.authApi.login({ ...loginInfo.payload }).pipe(
          tap({
            next: (res: any) => {
              // Lấy token linh hoạt từ cấu trúc phản hồi của backend
              const token =
                res?.token ||
                res?.result?.token ||
                res?.result?.accessToken ||
                res?.accessToken ||
                res?.data?.token ||
                res?.data?.accessToken;

              // Lấy thông tin user
              const user =
                res?.sve_member ||
                res?.result?.user ||
                res?.user ||
                res?.result;

              // Kiểm tra lỗi nếu có mã lỗi 4xx/5xx
              const hasError = (res?.status && res?.status >= 400) || (res?.code && res?.code >= 400);

              if (res && token && !hasError) {
                // Đăng nhập thành công
                this.patchState({ loginInfo: res, errorMessage: null });
                this.localStorageService.setItem(
                  LocalStorageKey.APP_ACCESS_TOKEN,
                  token
                );
                if (user) {
                  this.localStorageService.setItem(
                    LocalStorageKey.APP_USER,
                    user
                  );
                }
                this.toast.success('Đăng nhập thành công!');
                // Đăng nhập thành công → vào trang Home
                this.router.navigate(['/home']);
              } else {
                // Đăng nhập thất bại
                const errorMsg =
                  res?.message ||
                  'Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản hoặc mật khẩu!';
                this.patchState({ loginInfo: null, errorMessage: errorMsg });
                this.toast.error(errorMsg);
              }
            },
            error: (err) => {
              const errorMsg =
                err?.error?.message ||
                err?.message ||
                'Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản hoặc mật khẩu!';
              this.patchState({ loginInfo: null, errorMessage: errorMsg });
              this.toast.error(errorMsg);
            },
          }),
          catchError(() => of(null)),
          finalize(() =>
            this.patchState((state) => ({
              ...state,
              pageLoading: { isLoading: false },
            }))
          )
        )
      )
    )
  );

  readonly logout = this.effect((logoutInfo$) =>
    logoutInfo$.pipe(
      tap(() => {
        this.router.navigate(['/login']);
        this.patchState({ pageLoading: { isLoading: true } });
      }),
      exhaustMap(() =>
        this.authApi
          .logout({
            token: this.localStorageService.getItem(
              LocalStorageKey.APP_ACCESS_TOKEN
            ),
          })
          .pipe(
            tap({
              next: () => {
                this.localStorageService.removeAllItem();
              },
              error: (err) => {
                this.toast.error(`${err.error.message}`);
              },
            }),
            catchError(() => of(null)),
            finalize(() =>
              this.patchState({ pageLoading: { isLoading: false } })
            )
          )
      )
    )
  );
}