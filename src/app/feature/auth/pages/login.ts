import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AuthStore } from '../store/auth.store';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    CardModule,
    ToastModule,
  ],
  template: `
    <div class="flex items-center justify-center min-h-screen bg-gray-100">
      <div class="w-full max-w-md">
        <p-card>
          <h2 class="text-2xl font-bold text-center mb-6">Đăng nhập</h2>

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                type="text"
                pInputText
                formControlName="username"
                class="w-full"
                placeholder="email@example.com"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
              <p-password
                formControlName="password"
                [toggleMask]="true"
                [feedback]="false"
                class="w-full"
              />
            </div>

            <button
              pButton
              type="submit"
              label="Đăng nhập"
              class="w-full"
              [loading]="(vm$ | async)?.pageLoading?.['isLoading']"
            ></button>
          </form>
        </p-card>
      </div>
    </div>
  `,
  providers: [AuthStore, MessageService],
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private store = inject(AuthStore);

  loginForm: FormGroup = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  vm$ = this.store.vm$;

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.store.login({ payload: this.loginForm.value });
    }
  }
}