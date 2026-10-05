import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { tap, exhaustMap, finalize, catchError, of } from 'rxjs';
import { AuthApi } from '../../../core/apis/auth.api';
import { ToastService } from '../../../core/services/toast.service';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { LocalStorageKey } from '../../../shared/models/const.model';
import { LoginRequest, LoginResponse } from '../../../shared/models/login.model';
import { Router } from '@angular/router';

export interface AuthState {
  loginInfo: LoginResponse | null;
  pageLoading: { [key: string]: boolean };
  dialogVisible: { [key: string]: boolean };
}

@Injectable({ providedIn: 'root' })
export class AuthStore extends ComponentStore<AuthState> {
  // ========== SELECTORS ==========
  readonly loginInfo$ = this.select((s) => s.loginInfo);
  readonly pageLoading$ = this.select((s) => s.pageLoading);
  readonly dialogVisible$ = this.select((s) => s.dialogVisible);

  readonly vm$ = this.select(
    this.loginInfo$,
    this.pageLoading$,
    this.dialogVisible$,
    (loginInfo, pageLoading, dialogVisible) => ({
      loginInfo,
      pageLoading,
      dialogVisible,
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
      dialogVisible: {},
    });
  }

  // ========== EFFECTS ==========
  readonly login = this.effect<{ payload: LoginRequest }>((loginInfo$) =>
    loginInfo$.pipe(
      tap(() => this.patchState({ pageLoading: { isLoading: true } })),
      exhaustMap((loginInfo) =>
        this.authApi.login({ ...loginInfo.payload }).pipe(
          tap({
            next: (res: any) => {
              this.patchState({ loginInfo: res || null });
              this.localStorageService.setItem(
                LocalStorageKey.APP_ACCESS_TOKEN,
                res.result.token
              );
              this.localStorageService.setItem(
                LocalStorageKey.APP_USER,
                res.result.user
              );
              this.router.navigate(['/home']);
            },
            error: (err) => {
              this.toast.error(`${err.error.message}`);
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

  // ========== UPDATERS ==========
  readonly setDialogVisible = this.updater<{ key: string; value: boolean }>(
    (state, obj) => ({
      ...state,
      dialogVisible: {
        [obj.key]: obj.value,
      },
    })
  );
}