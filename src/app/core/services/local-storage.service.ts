import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from './app.service';
import { LocalStorageKey } from '../../shared/models/const.model';

const APP_PREFIX = '@@';

@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  constructor(private appService: AppService, private router: Router) {}

  setItem(key: string, value: any) {
    try {
      localStorage.setItem(
        `${APP_PREFIX}${key}${this.appService.config.version}`,
        JSON.stringify(value)
      );
    } catch (e) {
      localStorage.setItem(
        `${APP_PREFIX}${key}${this.appService.config.version}`,
        value
      );
    }
  }

  getItem(key: string): any {
    const value = localStorage.getItem(
      `${APP_PREFIX}${key}${this.appService.config.version}`
    );
    try {
      return JSON.parse(value as any);
    } catch (e) {
      return value;
    }
  }

  getAppToken(): string {
    const token = this.getItem(LocalStorageKey.APP_ACCESS_TOKEN);
    if (!token) {
      this.router.navigate(['/login']);
      return '';
    }
    return token;
  }

  removeAllItem() {
    Object.values(LocalStorageKey).forEach((key) => {
      localStorage.removeItem(
        `${APP_PREFIX}${key}${this.appService.config.version}`
      );
    });
  }
}