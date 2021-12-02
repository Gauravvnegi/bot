import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApiService } from 'libs/shared/utils/src/lib/api.service';
import { Observable } from 'rxjs';

@Injectable()
/**
 * Manages all the api call for authentication
 * @author Amit Singh
 */
export class AuthService extends ApiService {
  login(loginData): Observable<any> {
    return this.post(`/api/v1/user/login`, loginData);
  }

  forgotPassword(email): Observable<any> {
    return this.put(`/api/v1/user/forgot-password`, { email });
  }

  changePassword(data): Observable<any> {
    return this.put(`/api/v1/user/change-password`, data);
  }

  refreshAccessToken(config): Observable<any> {
    return this.post(`/api/v1/user/tokens/refresh`, config);
  }

  getTokenByName(tokenName: string) {
    return localStorage.getItem(tokenName);
  }

  isAuthenticated(): boolean {
    const xAuthToken = this.getTokenByName('x-authorization');
    const xAccessToken = this.getTokenByName('x-access-token');
    const xUserIdToken = this.getTokenByName('x-userId');

    return !!xAuthToken && !!xAccessToken && !!xUserIdToken;
  }

  setTokenByName(tokenName: string, value: string) {
    localStorage.setItem(tokenName, value);
  }

  clearToken() {
    localStorage.clear();
  }

  logout(userId): Observable<any> {
    return this.post(`/api/v1/user/${userId}/logout`, {});
  }
}
