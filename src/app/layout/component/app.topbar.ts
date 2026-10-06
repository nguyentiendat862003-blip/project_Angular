import { Component, OnInit, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { filter, take } from 'rxjs/operators';
import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { LayoutService } from '../service/layout.service';
import { LocalStorageService } from '../../core/services/local-storage.service';
import { AuthApi } from '../../core/apis/auth.api';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [NgClass, Menu],
  templateUrl: './app.topbar.html',
})
export class AppTopbar implements OnInit {
  readonly layoutService = inject(LayoutService);

  private readonly router = inject(Router);
  private readonly localStorageService = inject(LocalStorageService);
  private readonly authApi = inject(AuthApi);

  pageTitle = 'Trang chủ';
  pageSection = 'Tổng quan';
  userMenuItems: MenuItem[] = [];

  ngOnInit(): void {
    this.updateTitle(this.router.url);

    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => this.updateTitle(e.urlAfterRedirects));

    this.userMenuItems = [
      {
        label: 'Trang chủ',
        icon: 'pi pi-home',
        command: () => this.router.navigate(['/home']),
      },
      {
        label: 'Welcome',
        icon: 'pi pi-star-fill',
        command: () => this.router.navigate(['/home/welcome']),
      },
      { separator: true },
      {
        label: 'Đăng xuất',
        icon: 'pi pi-sign-out',
        command: () => this.logout(),
      },
    ];
  }

  get isCollapsed(): boolean {
    return this.layoutService.layoutState().staticMenuDesktopInactive ?? false;
  }

  private updateTitle(url: string): void {
    if (url.startsWith('/home/welcome')) {
      this.pageSection = 'Tổng quan';
      this.pageTitle = 'Welcome';
    } else if (url.startsWith('/notfound')) {
      this.pageSection = 'Hệ thống';
      this.pageTitle = 'Không tìm thấy trang';
    } else {
      this.pageSection = 'Tổng quan';
      this.pageTitle = 'Trang chủ';
    }
  }

  logout(): void {
    const token = this.localStorageService.getAppToken();

    if (token) {
      this.authApi
        .logout({ token })
        .pipe(take(1))
        .subscribe({ error: () => undefined });
    }

    this.localStorageService.removeAllItem();
    this.router.navigate(['/login']);
  }
}
