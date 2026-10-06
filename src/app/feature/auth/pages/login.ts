import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AuthStore } from '../store/auth.store';
import { AsyncPipe } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ButtonModule,
    InputTextModule,
    ReactiveFormsModule,
    AsyncPipe,
    ToastModule
  ],
  templateUrl: './login.html',
})
export class Login implements OnInit, OnDestroy {
  private readonly auStore = inject(AuthStore);
  private readonly messageService = inject(MessageService);
  private readonly subscription = new Subscription();

  readonly vm$ = this.auStore.vm$;

  showPassword = false;
  hasSubmitted = false;

  // Thông báo hiển thị ngay trong khung form
  formMessage: { type: 'error' | 'success' | 'warn' | 'info'; text: string } | null = null;

  loginForm: FormGroup = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  constructor() {}

  ngOnInit(): void {
    // 1. Khi đăng nhập thành công
    this.subscription.add(
      this.auStore.loginInfo$.subscribe((loginInfo: any) => {
        const token =
          loginInfo?.token ||
          loginInfo?.result?.token ||
          loginInfo?.result?.accessToken ||
          loginInfo?.accessToken;

        if (this.hasSubmitted && token) {
          const msg = 'Đăng nhập thành công!';
          this.formMessage = { type: 'success', text: msg };
        }
      })
    );

    // 2. Khi AuthStore thông báo lỗi
    this.subscription.add(
      this.auStore.errorMessage$.subscribe((errMsg) => {
        if (this.hasSubmitted && errMsg) {
          this.formMessage = { type: 'error', text: errMsg };
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  login(): void {
    this.formMessage = null;

    // 1. Kiểm tra nếu form chưa điền đầy đủ thông tin
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      const msg = 'Vui lòng điền đầy đủ tên đăng nhập và mật khẩu!';
      this.formMessage = { type: 'warn', text: msg };
      this.messageService.add({
        severity: 'warn',
        summary: 'Cảnh báo',
        detail: msg,
        life: 3000
      });
      return;
    }

    this.hasSubmitted = true;

    // 2. Gọi AuthStore login
    this.auStore.login({ payload: this.loginForm.value });
  }
}