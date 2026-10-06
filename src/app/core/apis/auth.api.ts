import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../shared/models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthApi {
  constructor(private http: HttpClient) {}

  login(payload: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(
      '/apps/sve/security/login',
      payload
    );
  }

  logout(payload: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(
      '/apps/sve/security/logout',
      payload
    );
  }

  refreshToken(payload: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(
      '/apps/sve/security/roles/check',
      payload
    );
  }

  introspect(payload: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(
      '/check_token',
      payload
    );
  }
}
