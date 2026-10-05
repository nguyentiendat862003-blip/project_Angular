import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AppService {
  private _config!: any;

  async loadAppConfig(): Promise<any> {
    const res = await fetch('/config/web_config.json');
    const config = await res.json();
    this._config = config;
    return config;
  }

  get config(): any {
    return this._config;
  }
}