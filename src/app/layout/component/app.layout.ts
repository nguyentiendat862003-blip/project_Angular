import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LayoutService } from '../service/layout.service';
import { AppSidebar } from './app.sidebar';
import { AppTopbar } from './app.topbar';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, AppSidebar, AppTopbar],
  template: `
    <div class="layout-wrapper min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-200">
      <!-- Menu bên trái -->
      <app-sidebar />

      <!-- Nền mờ khi mở menu trên mobile -->
      @if (layoutService.layoutState().staticMenuMobileActive) {
      <button
        type="button"
        class="layout-backdrop fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm"
        (click)="layoutService.closeOverlayMenu()"
        aria-label="Đóng menu">
      </button>
      }

      <!-- Thanh công cụ trên cùng -->
      <app-topbar />

      <!-- Nội dung trang -->
      <div class="layout-content" [class.is-collapsed]="isCollapsed">
        <main class="max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
})
export class AppLayout {
  readonly layoutService = inject(LayoutService);

  get isCollapsed(): boolean {
    return this.layoutService.layoutState().staticMenuDesktopInactive ?? false;
  }
}
