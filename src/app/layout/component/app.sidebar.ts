import { Component, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LayoutService } from '../service/layout.service';

interface MenuItem {
  label: string;
  icon: string;
  routerLink: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgClass],
  templateUrl: './app.sidebar.html',
})
export class AppSidebar {
  readonly layoutService = inject(LayoutService);

  readonly items: MenuItem[] = [
    { label: 'Trang chủ', icon: 'pi pi-home', routerLink: '/home' },
    { label: 'Welcome', icon: 'pi pi-star', routerLink: '/home/welcome' },
  ];

  get isCollapsed(): boolean {
    return this.layoutService.layoutState().staticMenuDesktopInactive ?? false;
  }

  get isMobileOpen(): boolean {
    return this.layoutService.layoutState().staticMenuMobileActive ?? false;
  }
}
