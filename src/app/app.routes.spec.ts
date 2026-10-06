import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { appRoutes } from './app.routes';
import { AuthApi } from './core/apis/auth.api';
import { AppService } from './core/services/app.service';

describe('App routes', () => {
  let httpMock: HttpTestingController;

  /** AuthApi giả: token luôn hợp lệ, để AuthGuard cho qua */
  const fakeAuthApi = {
    introspect: () => of({ result: { valid: true } }),
    refreshToken: () => of({ result: {} }),
    login: () => of({ result: {} }),
    logout: () => of({ result: {} }),
  };

  /** AppService giả: đã load web_config.json (bình thường do app initializer làm) */
  const fakeAppService = {
    config: { version: '1.0.0', baseUrl: '/api' },
    loadAppConfig: () => Promise.resolve({}),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter(appRoutes),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AuthApi, useValue: fakeAuthApi },
        { provide: AppService, useValue: fakeAppService },
        MessageService,
      ],
    });
    httpMock = TestBed.inject(HttpTestingController);
    // Giả lập user đã đăng nhập: có token trong localStorage
    localStorage.setItem('@@app_acsess_token1.0.0', JSON.stringify('fake-jwt'));
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('/notfound hiển thị trang Notfound', async () => {
    const harness = await RouterTestingHarness.create('/notfound');
    const text = harness.routeNativeElement?.textContent ?? '';
    expect(text).toContain('404');
    expect(text).toContain('Không tìm thấy trang');
  });

  it('URL không tồn tại sẽ đi đâu?', async () => {
    await RouterTestingHarness.create('/khong-ton-tai');
    expect(TestBed.inject(Router).url).toBe('/notfound');
  });

  it('/home/welcome hiển thị trang Welcome (khi token hợp lệ)', async () => {
    const harness = await RouterTestingHarness.create('/home/welcome');
    await harness.fixture.whenStable();
    const text = harness.routeNativeElement?.textContent ?? '';
    expect(text).toContain('Chào mừng');
  });
});
