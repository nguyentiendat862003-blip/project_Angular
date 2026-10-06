import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AppService {
  private _config: any = null;

  async loadAppConfig(): Promise<any> {
    try {
      const res = await fetch('/config/web_config.json');
      if (!res.ok) {
        throw new Error(`Failed to load config: ${res.status}`);
      }
      const config = await res.json();
      this._config = config;
      return config;
    } catch (error) {
      console.error('Failed to load app config:', error);
      throw error;
    }
  }

  get config(): any {
    return this._config;
  }
}
