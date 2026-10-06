import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { firstValueFrom, of } from 'rxjs';
import { AuthApi } from '../../core/apis/auth.api';
import { LocalStorageService } from '../../core/services/local-storage.service';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  const introspect = vi.fn();
  const refreshToken = vi.fn();

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        {
          provide: AuthApi,
          useValue: { introspect, refreshToken },
        },
        {
          provide: LocalStorageService,
          useValue: { getAppToken: () => 'fake-token' },
        },
      ],
    });
    guard = TestBed.inject(AuthGuard);
    introspect.mockReset();
    refreshToken.mockReset();
  });

  it('cho phép vào home khi backend trả { status: 1, message: "OK" }', async () => {
    introspect.mockReturnValue(of({ status: 1, message: 'OK' }));

    await expect(firstValueFrom(guard.canActivate())).resolves.toBe(true);
    expect(refreshToken).not.toHaveBeenCalled();
  });

  it('cho phép vào home khi backend trả { result: { valid: true } }', async () => {
    introspect.mockReturnValue(of({ result: { valid: true } }));

    await expect(firstValueFrom(guard.canActivate())).resolves.toBe(true);
  });

  it('thử refresh khi token không hợp lệ (status = 0)', async () => {
    introspect.mockReturnValue(of({ status: 0, message: 'Token expired' }));
    refreshToken.mockReturnValue(of({ status: 1 }));

    await expect(firstValueFrom(guard.canActivate())).resolves.toBe(true);
    expect(refreshToken).toHaveBeenCalledTimes(1);
  });

  it('cho phép khi backend trả code 200', async () => {
    introspect.mockReturnValue(of({ code: 200, message: 'OK' }));

    await expect(firstValueFrom(guard.canActivate())).resolves.toBe(true);
  });
});
