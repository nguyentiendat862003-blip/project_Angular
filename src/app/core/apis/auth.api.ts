import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppService } from '../services/app.service';
import { ApiResponse } from '../../shared/models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthApi {
  constructor(private http: HttpClient, private appService: AppService) {}

  login(payload: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(
      `${this.appService.config.baseUrl}/apps/sve/security/login`,
      payload
    );
  }

  logout(payload: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(
      `${this.appService.config.baseUrl}/apps/sve/security/logout`,
      payload
    );
  }

  refreshToken(payload: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(
      `${this.appService.config.baseUrl}/apps/sve/security/roles/check`,
      payload
    );
  }

  introspect(payload: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(
      `${this.appService.config.baseUrl}/check_token`,
      payload
    );
  }
}