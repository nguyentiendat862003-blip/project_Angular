import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface layoutConfig {
  preset?: string;
  primary?: string;
  surface?: string | undefined | null;
  darkTheme?: boolean;
  menuMode?: string;
}

interface LayoutState {
  staticMenuDesktopInactive?: boolean;
  overlayMenuActive?: boolean;
  staticMenuMobileActive?: boolean;
  menuHoverActive?: boolean;
}

@Injectable({ providedIn: 'root' })
export class LayoutService {
  _config: layoutConfig = {
    preset: 'Aura',
    primary: 'emerald',
    surface: null,
    darkTheme: false,
    menuMode: 'static',
  };

  _state: LayoutState = {
    staticMenuDesktopInactive: false,
    overlayMenuActive: false,
    staticMenuMobileActive: false,
    menuHoverActive: false,
  };

  private readonly STORAGE_KEY = 'themeSwitcherState';
  platformId = inject(PLATFORM_ID);

  // Signals
  layoutConfig = signal<layoutConfig>(this._config);
  layoutState = signal<LayoutState>(this._state);

  constructor() {
    // Khôi phục dark mode đã lưu (nếu có) khi mở app
    if (isPlatformBrowser(this.platformId)) {
      try {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        const parsed: layoutConfig | null = stored ? JSON.parse(stored) : null;
        if (parsed?.darkTheme) {
          this._config.darkTheme = true;
          this.layoutConfig.set({ ...this._config });
          document.documentElement.classList.add('app-dark');
        }
      } catch {
        // Bỏ qua: localStorage có thể bị chặn
      }
    }
  }

  // Computed
  isDarkTheme = computed(() => this.layoutConfig().darkTheme);
  isSidebarActive = computed(
    () =>
      this.layoutState().overlayMenuActive ||
      this.layoutState().staticMenuMobileActive
  );

  isDesktop() {
    return window.innerWidth > 991;
  }

  isMobile() {
    return !this.isDesktop();
  }

  // Toggle menu
  onMenuToggle() {
    if (this.isDesktop()) {
      this.layoutState.update((prev) => ({
        ...prev,
        staticMenuDesktopInactive: !prev.staticMenuDesktopInactive,
      }));
    } else {
      this.layoutState.update((prev) => ({
        ...prev,
        staticMenuMobileActive: !prev.staticMenuMobileActive,
      }));
    }
  }

  // Đóng menu (dùng khi bấm lớp nền mờ trên mobile)
  closeOverlayMenu() {
    this.layoutState.update((prev) => ({
      ...prev,
      overlayMenuActive: false,
      staticMenuMobileActive: false,
    }));
  }

  // Toggle dark mode
  toggleDarkMode() {
    this.layoutConfig.update((prev) => ({
      ...prev,
      darkTheme: !prev.darkTheme,
    }));

    if (this.layoutConfig().darkTheme) {
      document.documentElement.classList.add('app-dark');
    } else {
      document.documentElement.classList.remove('app-dark');
    }

    // Lưu lại lựa chọn để lần mở sau giữ nguyên
    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.setItem(
          this.STORAGE_KEY,
          JSON.stringify(this.layoutConfig())
        );
      } catch {
        // Bỏ qua: localStorage có thể bị chặn
      }
    }
  }
}